package temi.robot.extension.capabilities

import temi.robot.extension.mqtt.RobotMQTT
import temi.robot.extension.RobotClient
import temi.robot.extension.events.*
import temi.robot.extension.commands.*

/**
 * AUTO-GENERATED FILE — DO NOT EDIT
 *
 * Capability: temi/{robotId}/event/battery
 */
class TemiRobotIdEventBatteryCapability(
    private val client: RobotClient,
    private val mqtt: RobotMQTT
) {

    // Commands implemented by this capability
    fun supportedCommands(): List<String> = listOf(
    )

    fun handleCommand(command: String, payload: String?) {
        when (command) {
            else -> mqtt.publishError("Unknown command '[object Object]' in temi/{robotId}/event/battery")
        }
    }
}