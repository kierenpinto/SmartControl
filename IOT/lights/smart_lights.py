import serial, time
ser = serial.Serial('/dev/ttyACM0')

# Import SDK packages
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

import time
import json

# For certificate based connection
myMQTTClient = AWSIoTMQTTClient("Lights")
api_endpoint = "af0fl7pfhxnuf-ats.iot.us-west-2.amazonaws.com"

myMQTTClient.configureEndpoint(api_endpoint, 8883)

CAPath = "./certificates/AmazonRootCA1.pem"
PrivateKeyPath = "./certificates/f65c00a9ac-private.pem.key"
CertPath = "./certificates/f65c00a9ac-certificate.pem.crt"

myMQTTClient.configureCredentials(CAPath, PrivateKeyPath, CertPath)

myMQTTClient.connect()
myMQTTClient.publish("myTopic", "myPayload", 0)
def on_receive(client, userdata, message):
    print("topic",message.topic)
    print("payload", message.payload)
    msg_obj = json.loads(message.payload.decode('utf-8'))
    on = msg_obj['on']
    if (on):
        ser.write(b'255255255\n')
    else:
        ser.write(b'000000000\n')

myMQTTClient.subscribe("myTopic", 1, on_receive)
print("subscribed")

try:
    while(True):
        time.sleep(1)
except: 
    myMQTTClient.unsubscribe("myTopic")
    myMQTTClient.disconnect()
    ser.close()
    print("unsubscribed and disconnected")

