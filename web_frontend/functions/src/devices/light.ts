import {Device, DeviceTypes} from './device'


class LightStates {
    private _brightness:number;
    private _on:boolean;
    constructor(brightness:string|number,on:boolean ){
        this._brightness = <number> brightness;
        this._on = on;
    }

    public set on(val:boolean){
        this._on = val;
    }
    
    public get on() : boolean {
        return this._on;
    }

    public set brightness(val:number|string){
        this._brightness = <number> val;
    }    

    public get brightness() {
        return this._brightness;
    }
}

class Light extends Device<LightStates>{
    protected _states: LightStates;
    constructor(id: string, name: string, states: LightStates, userid: string, userRef:any){
        super(id,name,DeviceTypes.Light,userid);
        this._states = states;
        this._userRef = userRef
    }
}


export {Light, LightStates}
export default Light;