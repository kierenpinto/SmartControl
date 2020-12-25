import {Device, DeviceTypes, /*DeviceActions, DeviceActionResponse */} from './device'

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
    protected _states: CurtainStates;
    constructor(id: string, name: string, states: CurtainStates, type: DeviceTypes, user: string){
        super(id,name,type,user);
        this._states = states;
    }
    public get states(){
        return this._states;
    }
}

/*
class CurtainActions extends DeviceActions{
    public openToPercent(percent:number){
        this.actions.set('openPercent',percent);
    }

    public runActions(id:string): Map<string, DeviceActionResponse> {
        // Send commant to IOT device

        // await response from IOT device

        //Update database

        //await response from database

        //return response


        // Comment out when done
        throw new Error("Curtain Actions run method not implemented.");
    }
    

}
export {CurtainActions}
*/
export {Curtain}
export default Curtain;