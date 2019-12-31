Sample Execute Body Request

```json
{ "inputs": [
    { "context": {
        "locale_country": "AU", "locale_language": "en" 
        }, "intent": "action.devices.EXECUTE", 
        "payload": {
            "commands": [
                { "devices": [{ "id": "123" }], "execution": [
                    { "command": "action.devices.commands.OpenClose", "params": { "openPercent": 100 } 
                }] 
            }] 
        } 
    }], "requestId": "13182237911901383771" 
}
```