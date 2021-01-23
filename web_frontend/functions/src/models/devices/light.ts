import { DeleteDevice, Device, DeviceAction, DeviceActionGroup, DeviceTypes, RenameDevice} from '.'
import { FirestoreLightDBAdapter, LightFirestoreConverter } from '../../firestore/devices/light';

class LightStates {
    private _brightness:number;
    
    constructor(brightness:number = 100,public on:boolean = false){
        this._brightness = brightness;
    }

    public set brightness(val:number|string){
        const value = Number(val);
        if (value<0 || value>100){
            throw new Error(`Brightness set to ${value}. It should be between 0 and 100`)
        }
        this._brightness = value;
    }

    public get brightness() {
        return this._brightness;
    }
}
export {LightStates}

/**
 * Model for light device
 */
class Light extends Device<LightStates>{
    ActionGroup = LightActionGroup 
    converter = LightFirestoreConverter;
    protected _states: LightStates;
    public get states(): LightStates {
        return this._states;
    }
    constructor(id: string, name: string, states: LightStates, userid: string){
        super(id,name,DeviceTypes.Light,userid);
        this._states = states;
    }
}
export {Light}

export class DeleteLight extends DeleteDevice<Light> {
    protected IOTDelete() {
        // throw new Error('Method not implemented.');
        console.error("IOTDelete not yet implemented")
    }

}

export class RenameLight extends RenameDevice<Light> {
    async get(device_id: string): Promise<Light> {
         const light = await this.dbAdapter.get(device_id);
         if(light){
             return light;
         } else {
             throw new Error("No light found");
         }
    }
}
class LightActionGroup extends DeviceActionGroup<Light> {
    constructor( initialState:Light, actions: DeviceAction<Light>[], public dbAdapter:FirestoreLightDBAdapter){
        super(initialState,dbAdapter);
        this.actions = actions
    }
    getIOT(options: any): any {
        console.error('getIOT not implemented')
        // throw new Error('Method not implemented.');
    }
    updateIOT(data: Light): any {
        console.error('updateIOT not implemented')
        // throw new Error('Method not implemented.');
        return
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

export default Light;