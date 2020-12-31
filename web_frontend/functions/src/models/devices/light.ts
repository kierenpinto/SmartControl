import {Device, DeviceAction, DeviceActionGroup, DeviceTypes} from '.'


class LightStates {
    private _brightness:number;
    
    constructor(brightness:number = 100,public on:boolean = false){
        this._brightness = brightness;
    }

    public set brightness(val:number|string){
        if (typeof(val) === 'string'){
            val = Number(val);
        }
        if (val<0 || val>100){
            throw new Error(`Brightness set to ${val}. It should be between 0 and 100`)
        }
        this._brightness = val;
    }

    public get brightness() {
        return this._brightness;
    }
}

/**
 * Model for light device
 */
class Light extends Device<LightStates>{
    protected _states: LightStates;
    public get states(): LightStates {
        return this._states;
    }
    constructor(id: string, name: string, states: LightStates, userid: string){
        super(id,name,DeviceTypes.Light,userid);
        this._states = states;
    }
}

/**
 * Not sure what this is - probably need to move this code somewhere.
 * @param light 
 * @param transaction 
 */
// async function updateLightChain(light:Light,transaction:FirebaseFirestore.Transaction){
    
//     const FSDevice = new FirestoreDevice(light.name,DeviceTypes[light.type],light._userRef,new Map(Object.entries(light.states)))
//     return updateDeviceStates(light.id,FSDevice,transaction)

// }
// export {updateLightChain};

class LightActionGroup extends DeviceActionGroup<Light> {
    constructor(transaction: FirebaseFirestore.Transaction, deviceId:string, actions: DeviceAction<Light>[], initialState?:Light){
        super(transaction,deviceId,initialState);
        this.actions = actions
    }
    getData(): Promise<Light> {
        throw new Error('Method not implemented.');
    }
    getIOT(options: any): Promise<any> {
        throw new Error('Method not implemented.');
    }
    updateIOT(data: Light): Promise<any> {
        throw new Error('Method not implemented.');
    }
    updateData(data: Light): Promise<any> {
        throw new Error('Method not implemented.');
    }
    actions: DeviceAction<Light>[];
    resolveState(dbData: Light, IOTData: any): Light {
        //throw new Error('Method not implemented.');
        return dbData;
    }
}

export {LightActionGroup}

/**
 * Generate on or off action.
 * @param toggle True or false : on and off;
 */
function OnOff (toggle:boolean){
    let Func: DeviceAction<Light>;
    Func = function(initialState:Light){
        initialState.states.on = toggle;
        return initialState
    }
    return Func;
}

/**
 * Generates Brightness Action
 * @param brightness Number between 0 and 100
 */
function Brightness (brightness:number){
    let Func: DeviceAction<Light>;
    Func = function(initialState:Light){
        initialState.states.brightness = brightness;
        return initialState
    }
    return Func;
}

const LightActions = {
    OnOff,
    Brightness
}
export {LightActions}


// class LightActions extends DeviceActions{
//     device:Light
//     public onSwitch(on:boolean){
//         this.actions.set('on',on);
//     }

//     public brightness(amount:number){
//         this.actions.set('brightness',amount);
//     };

//     /**
//      * Light object that represents the current state of the light device
//      * @param light 
//      */
//     constructor(light:Light){
//         super();
//         this.device = light;
//     }

//     public runActions(): Map<string, DeviceActionResponse> {
        
//         const brightness = this.actions.get('brightness')
//         const on = this.actions.get('on');

        
//         // Send commant to IOT device

//         // await response from IOT device

//         //Update database

//         //await response from database

//         //return response


//         // Comment out when done

//         throw new Error("Method not implemented.");
//     }
// }

export {Light, LightStates}
export default Light;