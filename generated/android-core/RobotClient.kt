package robo2mqtt.core.api.mqtt

import org.eclipse.paho.client.mqttv3.*

/**
 * AUTO-GENERATED FILE — DO NOT EDIT
 *
 * RobotMQTT: lightweight helper for publishing/subscribing to MQTT.
 */
class RobotMQTT(
    private val client: MqttClient
) {

    fun publish(topic: String, payload: String, retained: Boolean = false) {
        val msg = MqttMessage(payload.toByteArray())
        msg.isRetained = retained
        client.publish(topic, msg)
    }

    fun publishError(error: String) {
        publish("robot/error", error)
    }

    fun subscribe(topic: String, handler: (String) -> Unit) {
        client.subscribe(topic) { _, msg ->
            handler(String(msg.payload))
        }
    }
}