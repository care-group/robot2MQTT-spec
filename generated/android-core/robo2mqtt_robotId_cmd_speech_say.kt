package robo2mqtt.core.api.capabilities

import robo2mqtt.core.api.mqtt.RobotMQTT
import robo2mqtt.core.api.RobotClient
import robo2mqtt.core.api.events.*
import robo2mqtt.core.api.commands.*

/**
 * AUTO-GENERATED FILE — DO NOT EDIT
 *
 * Capability: robo2mqtt/{robotId}/cmd/speech/say
 */
class Robo2mqttRobotIdCmdSpeechSayCapability(
    private val client: RobotClient,
    private val mqtt: RobotMQTT
) {

    // Commands implemented by this capability
    fun supportedCommands(): List<String> = listOf(
        "say"
    )

    fun handleCommand(command: String, payload: String?) {
        when (command) {
        "say" -> client.onSay(payload)
            else -> mqtt.publishError("Unknown command '$command' in robo2mqtt/{robotId}/cmd/speech/say")
        }
    }
}
