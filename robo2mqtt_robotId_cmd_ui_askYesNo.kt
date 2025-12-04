package robo2mqtt.core.api.capabilities

import robo2mqtt.core.api.mqtt.RobotMQTT
import robo2mqtt.core.api.RobotClient
import robo2mqtt.core.api.events.*
import robo2mqtt.core.api.commands.*

/**
 * AUTO-GENERATED FILE — DO NOT EDIT
 *
 * Capability: robo2mqtt/{robotId}/cmd/ui/askYesNo
 */
class Robo2mqttRobotIdCmdUiAskYesNoCapability(
    private val client: RobotClient,
    private val mqtt: RobotMQTT
) {

    // Commands implemented by this capability
    fun supportedCommands(): List<String> = listOf(
        "askYesNo"
    )

    fun handleCommand(command: String, payload: String?) {
        when (command) {
        "askYesNo" -> client.onAskYesNo(payload)
            else -> mqtt.publishError("Unknown command '$command' in robo2mqtt/{robotId}/cmd/ui/askYesNo")
        }
    }
}
