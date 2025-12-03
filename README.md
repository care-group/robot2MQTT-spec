# robot2MQTT Specification

This repository contains the **protocol and interface specifications** for the `robot2MQTT` ecosystem.

The goal is to have a **robot-agnostic, language-agnostic** API that lets:

- Smart home systems (Home Assistant, openHAB, etc.)
- LLM-driven agents
- Custom scripts and services

…control and observe heterogeneous robots (Temi, Pepper, HSR, Furhat, etc.) via **MQTT** using a **consistent interface**.

The specs are written using **AsyncAPI** and describe:

- MQTT servers (brokers)
- Channels (topics)
- Message payloads (commands, events)
- Shared data models (e.g. Pose, BatteryState, Question/Answer)

## Repository layout

```text
robot2mqtt-spec/
│
├── core/
│   ├── asyncapi/
│   │   └── robot2mqtt-core.asyncapi.yaml
│   ├── schema/
│   │   ├── common.yaml
│   │   ├── speech.yaml
│   │   ├── movement.yaml
│   │   ├── ui.yaml
│   │   ├── apps.yaml
│   │   ├── media.yaml
│   │   └── robot.yaml
│   └── README.md
│
├── generators/
│   ├── android/
│   │   ├── templates/
│   │   │   ├── Capability.kt.hbs
│   │   │   ├── Event.kt.hbs
│   │   │   ├── RobotClient.kt.hbs
│   │   │   └── RobotMQTT.kt.hbs
│   │   ├── generator.js
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── ros/
│   ├── python/
│   ├── kotlin/
│   └── dotnet/
│       (future generators)
│
└── robots/
├── temi/
│   └── temi2mqtt.asyncapi.yaml
├── pepper-android/
│   └── pepper-android.asyncapi.yaml
├── pepper-naoqi/
│   └── pepper-naoqi.asyncapi.yaml
├── hsr/
│   └── hsr.asyncapi.yaml
└── furhat/
└── furhat.asyncapi.yaml

---

# 🤖 1. Core API (robot2mqtt-core)

Located under `core/`.

It contains:

- **robot2mqtt-core.asyncapi.yaml**  
  A clean, robot-agnostic AsyncAPI 2.6.0 specification

- **Modular YAML schemas** under `core/schema/`  
  These define reusable message types for:
  - Speech
  - Movement
  - UI
  - Apps
  - Media
  - Common utilities
  - Robot descriptor

### Purpose
The **core** specification defines the minimal API all Robo2MQTT robots must implement.

Robot extensions (Temi, Pepper, HSR…) may *add* capabilities, but may not break the core.

---

# 🔧 2. Robot-Specific Extensions

Located under `robots/`.

Each file extends the core specification, adding robot-specific:

- Topics  
- Events  
- Commands  
- Capabilities

Example: `robots/temi/temi2mqtt.asyncapi.yaml`.

Each robot has **full freedom** to define extra:
- Movement events
- Media extensions
- Hardware-specific capabilities
- Custom UI behaviors
- System functions (app control, settings, SLAM, etc.)

---

# 🛠 3. Code Generators

Located under `generators/`.

The first implemented generator is:

### ✔ `generators/android/`

Generates:

- Kotlin classes for:
  - Capabilities
  - Events
  - MQTT client wrappers
  - Unified RobotClient layer

Using templates:

emplates/
Capability.kt.hbs
Event.kt.hbs
RobotClient.kt.hbs
RobotMQTT.kt.hbs

### Usage

cd generators/android
npm install
npm run generate – <path-to-asyncapi.yaml>

Example:

npm run generate – ../../robots/temi/temi2mqtt.asyncapi.yaml ./output/

The generator is based on:

- `@asyncapi/parser`
- `handlebars`
- `fs-extra`
- Node.js ES modules

---

# 🤝 4. Design Principles

### ✔ Robot-Agnostic Core  
Every robot implements the same **core MQTT API**.

### ✔ Robot-Specific Extensions  
E.g., Temi battery, Temi app control, Pepper gestures, etc.

### ✔ AsyncAPI 2.6.0  
Used as **IDL for MQTT**.

### ✔ Modular YAML Schemas  
Separated for maintainability.

### ✔ Language-Agnostic Generators  
For:
- Android
- Kotlin
- Python
- ROS (via rosbridge)
- .NET

---

# 🚀 Goals of the Project

- Create a **standardized MQTT control protocol** for all robots
- Provide **LLM-friendly** capability metadata
- Make robots discoverable and uniform across:
  - Home Assistant
  - openHAB
  - MCP-based autonomous agents
- Allow future expansion to:
  - WebRTC media
  - SLAM streaming
  - Telepresence
  - Multi-robot orchestration

---

# 📘 How to Contribute

1. Fork the repository  
2. Add or modify schemas under `core/schema/`  
3. Add new robot specs under `robots/<robot>/`  
4. Implement new code generators under `generators/<language>/`  
5. Open a pull request

---

# 📩 Contact

Maintainer: **Mauro Dragone**  
Research: Robotics, Human-Robot Interaction, IoT  
Institution: **Heriot-Watt University, Edinburgh**

Contributions and collaborations welcome!
tools/
  generators/
    README.md              # future: code-generation notes
