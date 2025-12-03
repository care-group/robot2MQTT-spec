# Android Kotlin Generator for robot2mqtt

This generator produces Android/Kotlin robot-client modules from the
robot2mqtt AsyncAPI specifications.

## 📁 Input Files

- `../../core/asyncapi/robot2mqtt-core.asyncapi.yaml`
- `../../robots/<robot>/<robot>.asyncapi.yaml`
- Templates in `templates/`

## 📁 Output

Generated Android code is written to: generated//android/

## 🚀 Usage

Install dependencies:

npm install

Generate code for Temi: 

node generator.js temi

Generate code for Pepper (Android SDK):

## 📚 Files Generated

- `Capability.kt`
- `Event.kt`
- `RobotClient.kt`
- `RobotMQTT.kt`

These can be dropped directly into `robotcore`, `temi2mqtt`, `pepper2mqtt`, etc.