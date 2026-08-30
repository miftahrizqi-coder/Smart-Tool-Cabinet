from app.core.config import settings

print("MQTT HOST:", settings.mqtt_host)
print("MQTT PORT:", settings.mqtt_port)
print("MQTT USER:", settings.mqtt_username)
print("MQTT TLS:", settings.mqtt_use_tls)
print("MQTT CLIENT:", settings.mqtt_client_id)
