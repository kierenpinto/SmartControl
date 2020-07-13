import { isNull } from "lodash";


// enum DeviceTypes {
//     Light = "LIGHT",
//     Curtain = "CURTAIN"
// }

enum DeviceTypes {
    Light,
    Curtain
}

abstract class Device<DeviceStates>{
    private _name: string
    private _id: string;
    protected abstract _states: DeviceStates
    private _type: DeviceTypes
    private _userid: string
    public _userRef: any; //specialData
    
    constructor(id:string,name:string,type:DeviceTypes,userid:string){
        this._id = id;
        this._name = name;
        this._type = type;
        this._userid = userid;
    }
    public get name() : string {
        if(isNull(this._name)){
            // need to implment update
            this._name = 'Untitled';
        }
        return this._name;
    }
    public get id() : string{
        return this._id;
    }
    
    public get type() : DeviceTypes {
        return this._type;
    }

    public get user() : string {
        return this._userid;
    }

    public get states() : DeviceStates {
        return this._states;
    }

}

// interface DeviceAction{
//     name:string;
//     value:any;
// }
class DeviceActionResponse{
    public success:boolean;
    public message?:string;
    constructor(success:boolean,message?:string){
        if (message !== undefined){
            this.message = message;
        }
        this.success = success;
    }
}

/**
 * Implement Specific Device Actions in a chain to be executed on a single device.
 */
abstract class DeviceActions {
    actions:Map<string,any> = new Map;
    abstract runActions(id:string):Map<string,DeviceActionResponse>;
    abstract device:Device<any>;
}

export {Device,DeviceTypes, DeviceActionResponse, DeviceActions};
