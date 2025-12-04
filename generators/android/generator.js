import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import Parser from "@asyncapi/parser";
import yaml from "yaml";

Handlebars.registerHelper("capitalize", str => {
  if (typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
});

async function main() {
  const [,, inputFile, outputDir] = process.argv;
  const toPascalCase = str => str
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  if (!inputFile || !outputDir) {
    console.error("Usage: npm run generate -- <input-spec.yaml> <output-folder>");
    process.exit(1);
  }

  console.log(`Parsing AsyncAPI: ${inputFile}`);

  // Read YAML
  const yamlText = fs.readFileSync(inputFile, "utf8");
  const json = yaml.parse(yamlText);

  // IMPORTANT: AsyncAPI parser only supports AsyncAPI **2.x**
  if (!json.asyncapi || !json.asyncapi.startsWith("2.")) {
    console.error(`❌ ERROR: AsyncAPI version ${json.asyncapi} is not supported. Use asyncapi: "2.6.0"`);
    process.exit(1);
  }

  // Parse using the official parser
  let doc;
  try {
    doc = await Parser.parse(yamlText, { path: inputFile });
  } catch (err) {
    console.error("❌ Failed to parse AsyncAPI file:", err);
    process.exit(1);
  }

  console.log("✔ AsyncAPI parsed successfully");

  const packageName = (json.info?.title || "robot2mqtt")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

  // Extract capabilities from channels
  const capabilities = doc.channelNames().map(name => {
    const channel = doc.channel(name);
    const collected = [];

    const collectMessages = (operation, direction) => {
      if (!operation) return;
      const opMessages = operation.hasMultipleMessages()
        ? operation.messages()
        : [operation.message()];
      opMessages
        .filter(Boolean)
        .forEach(m => {
          const payload = m.payload && m.payload();
          collected.push({
            name: m.uid ? m.uid() : m.name(),
            payload: payload && payload.json ? payload.json() : null,
            direction
          });
        });
    };

    collectMessages(channel.hasPublish() ? channel.publish() : null, "publish");
    collectMessages(channel.hasSubscribe() ? channel.subscribe() : null, "subscribe");

    const safeName = name.replace(/[{}]/g, "").replace(/[\\/]/g, "_");
    const commandTopic = name.split("/").filter(Boolean).pop() || "command";
    const commands = Array.from(new Set(
      collected
        .filter(m => m.direction === "subscribe")
        .map(() => commandTopic)
    )).map(raw => ({
      raw,
      methodName: toPascalCase(raw),
    }));

    return {
      name,
      capabilityName: name,
      className: toPascalCase(safeName) || "Capability",
      packageName,
      commands,
      fileName: safeName || "capability",
      messages: collected
    };
  });

  // Prepare output
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load templates
  const templateDir = path.join(path.dirname(new URL(import.meta.url).pathname), "templates");

  const templates = {
    Capability: Handlebars.compile(fs.readFileSync(path.join(templateDir, "Capability.kt.hbs"), "utf8")),
    Event: Handlebars.compile(fs.readFileSync(path.join(templateDir, "Event.kt.hbs"), "utf8")),
    RobotClient: Handlebars.compile(fs.readFileSync(path.join(templateDir, "RobotClient.kt.hbs"), "utf8")),
    RobotMQTT: Handlebars.compile(fs.readFileSync(path.join(templateDir, "RobotMQTT.kt.hbs"), "utf8"))
  };

  // Generate each capability file
  for (const cap of capabilities) {
    const filePath = path.join(outputDir, `${cap.fileName}.kt`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const out = templates.Capability(cap);
    fs.writeFileSync(filePath, out);
  }

  // Generate shared files
  const sharedContext = { capabilities, packageName, package: packageName };
  fs.writeFileSync(path.join(outputDir, "RobotClient.kt"), templates.RobotClient(sharedContext));
  fs.writeFileSync(path.join(outputDir, "RobotMQTT.kt"), templates.RobotMQTT(sharedContext));

  console.log(`✔ Generation complete. Files written to: ${outputDir}`);
}

main();
