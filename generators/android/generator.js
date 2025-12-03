import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import Parser from "@asyncapi/parser";
import yaml from "yaml";

async function main() {
  const [,, inputFile, outputDir] = process.argv;

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
    doc = await Parser.parse(json);
  } catch (err) {
    console.error("❌ Failed to parse AsyncAPI file:", err);
    process.exit(1);
  }

  console.log("✔ AsyncAPI parsed successfully");

  // Extract capabilities from channels
  const channels = doc.channels();
  const capabilities = Object.keys(channels).map(name => ({
    name,
    messages: channels[name].messages().map(m => ({
      name: m.uid(),
      payload: m.payload().json()
    }))
  }));

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
    const out = templates.Capability(cap);
    fs.writeFileSync(path.join(outputDir, `${cap.name}.kt`), out);
  }

  // Generate shared files
  fs.writeFileSync(path.join(outputDir, "RobotClient.kt"), templates.RobotClient({ capabilities }));
  fs.writeFileSync(path.join(outputDir, "RobotMQTT.kt"), templates.RobotMQTT({ capabilities }));

  console.log(`✔ Generation complete. Files written to: ${outputDir}`);
}

main();