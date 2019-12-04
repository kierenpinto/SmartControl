On Execute demo response:

```json
{
      requestId: body.requestId,
      payload: {
        commands: [{
          ids: ["7b2tIs3OqKRAA8xjnBEg"],
          status: "SUCCESS",
          states: {
            openPercent: 100.0,
            online: true
          }
        }]
    }
}
```

On Query Demo Response:
```json
{
    requestId: body.requestId,
    payload: {
      devices: {
        "7b2tIs3OqKRAA8xjnBEg": {
          on: true,
          online: true,
          openPercent: 100.0
        }
      }
    },
}
```

On Sync demo response:

```json
{
requestId: body.requestId,
payload: {
  agentUserId: body.agentUserId,
  devices: [{
    id: "7b2tIs3OqKRAA8xjnBEg",
    type: "action.devices.types.CURTAIN",
    traits: [
      //"action.devices.traits.OnOff",
      'action.devices.traits.OpenClose',
    ],
    name: {
      defaultNames: ["My Curtains"],
      name: "Kieren's Bedroom Curtain"
    },
    willReportState: false,
  }]
},
}
```