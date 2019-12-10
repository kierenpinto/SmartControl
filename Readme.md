# Smart Control - A smart home platform.

Smart Control is an Open Source hobby built project to control home appliances through interaction with Alexa and Google Assistant and connect to Firebase Authentication. Currently it is still in early development.


## [AWS Lambda](./AWSLambda)

These work alongside the firebase cloud functions.

These functions were used for fullfilment of the cloud requests and for authentication with firebase services. These old functions can be found in web_frontend/functions.

## [AWS IOT Core](./IOT)
This code is used on the client side (Raspberry PI) to connect to AWS IOT core. This enables messages to be sent from the cloud to the application at the end user. 

## [Web Frontend](./web_frontend)
This directory comprises a few different front-end experiments in the public directory, and an in construction react-app in the react_source directory.

To start the react app:

` cd in ./web_frontend/react_source `

` yarn start `