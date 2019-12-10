# Import SDK packages
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

import time

# For certificate based connection
myMQTTClient = AWSIoTMQTTClient("Lights")
api_endpoint = "af0fl7pfhxnuf-ats.iot.us-west-2.amazonaws.com"

myMQTTClient.configureEndpoint(api_endpoint, 8883)

CAPath = "./certificates/AmazonRootCA1.pem"
PrivateKeyPath = "./certificates/f65c00a9ac-private.pem.key"
CertPath = "./certificates/f65c00a9ac-certificate.pem.crt"

myMQTTClient.configureCredentials(CAPath, PrivateKeyPath, CertPath)

# myMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
# myMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
# myMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
# myMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

myMQTTClient.connect()
myMQTTClient.publish("myTopic", "myPayload", 0)
def on_receive(client, userdata, message):
    print("topic",message.topic)
    print("payload", message.payload)

myMQTTClient.subscribe("myTopic", 1, on_receive)
print("subscribed")

try:
    while(True):
        time.sleep(1)
except: 
    myMQTTClient.unsubscribe("myTopic")
    myMQTTClient.disconnect()
    print("unsubscribed and disconnected")