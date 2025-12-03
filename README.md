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
asyncapi/
  core/
    robot2mqtt-core.yaml   # generic capability & message definitions
  robots/
    temi/
      temi2mqtt.yaml       # Temi-specific extensions & bindings
    pepper-android/
      pepper2mqtt.yaml     # future
    pepper-naoqi/
      pepper-naoqi2mqtt.yaml
    hsr/
      hsr2mqtt.yaml
    furhat/
      furhat2mqtt.yaml
tools/
  generators/
    README.md              # future: code-generation notes