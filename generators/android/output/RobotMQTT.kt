package temi.robot.extension.mqtt

import org.eclipse.paho.client.mqttv3.MqttClient
import org.eclipse.paho.client.mqttv3.MqttMessage

/**
 * AUTO-GENERATED — DO NOT EDIT
 * Standard MQTT abstraction for all robot integrations
 */
class RobotMQTT(private val mqtt: MqttClient, private val baseTopic: String) {

    fun publishState(sub: String, msg: String) {
        publish("$baseTopic/state/$sub", msg)
    }

    fun publishEvent(sub: String, msg: String) {
        publish("$baseTopic/event/$sub", msg)
    }

    fun publishError(sub: String, msg: String) {
        publish("$baseTopic/error/$sub", msg)
    }

    fun publish(topic: String, msg: String) {
        val m = MqttMessage(msg.toByteArray())
        m.isRetained = false
        mqtt.publish(topic, m)
    }
}