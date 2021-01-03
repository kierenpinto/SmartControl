import {Device, DeviceTypes, /*DeviceActions, DeviceActionResponse */} from '.'

/**
 * Represent the current curtain states
 */

class CurtainStates {
    private _openPercent:number;
    constructor(openPercent:string|number){
        this._openPercent = <number> openPercent;
    }

    public get openPercent() {
        return this._openPercent;
    }

    public get openPercentString(){
        return String(this._openPercent);
    }
}

/**
 * Represents a curtain object
 */

class Curtain extends Device<CurtainStates>{
    converter!: FirebaseFirestore.FirestoreDataConverter<any>;
    protected _states: CurtainStates;
    constructor(id: string, name: string, states: CurtainStates, type: DeviceTypes, user: string){
        super(id,name,type,user);
        this._states = states;
    }
    public get states(){
        return this._states;
    }
}

export {Curtain}
export default Curtain;