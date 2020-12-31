import { isNull } from "lodash";
import { ActionGroup, ModelAction, ModelTypes } from "../action";

enum DeviceTypes {
    Light = 'light',
    Curtain = 'curtain'
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

interface DeviceActionResponse <Device>{
    success:boolean,
    message?:string,
    newState: Device,
    IOTAction: string
}

/**
 * Implement a specific device action to be executed on a single device.
 */
// abstract class DeviceAction<Device> implements ModelAction {
//     ModelType: ModelTypes = ModelTypes.Device;
//     singular: boolean = false;
//     abstract do(initialState:Device) : Device;
// }
interface DeviceAction<Device> extends ModelAction {
    (initialState: Device): Device;
}

/**
 * Implements an action group which can run a series of actions on a single device.
 */

abstract class DeviceActionGroup<D extends Device<any>> implements ActionGroup {
    ModelType: ModelTypes = ModelTypes.Device;
    FirestoreTransaction: FirebaseFirestore.Transaction;
    abstract actions: Array<DeviceAction<D>>;
    async run(): Promise<any> {
        let dbState;
        if(!this.initialState){
            dbState = await this.getData()
        } else {
            dbState = this.initialState;
        }
        let IOTState
        try {
            IOTState = await this.getIOT({})
        } catch (error) {
            IOTState = false;
        }
        const initialState = this.resolveState(dbState, IOTState);
        const finalState = this.actions.reduce((state,action)=>{
            // return action.do(state)
            return action(state)
        }, initialState)
        this.updateIOT(finalState) // Some IOT Action
        this.updateData(finalState)
        throw new Error("Method not fully implemented.");
    }
    constructor(transaction: FirebaseFirestore.Transaction, public deviceId: string, public initialState?: D){
        this.FirestoreTransaction = transaction;
    }
    /**
     * Gets data from Firestore
     * @param options 
     */

    abstract getData(): Promise<D>
    /**
     * Gets data from IOT device
     * @param options Change this to some IOT options
     * @returns Should be a promise of some IOT return type
     */
    abstract getIOT(options:any): Promise<any>

    /**
     * Resolves the most up-to-date state from the database and the IOT device
     * @param data 
     */
    abstract resolveState(dbData: D, IOTData: any):D;
    /**
     * Sends data to IOT device
     * @param data Change this to some IOT Payload
     * @returns Should be a promise of some IOT return type
     */
    abstract updateIOT(data: D) : Promise<any>

    /**
     * Writes data to firestore
     * @param data The firestore payload to write.
     */
    abstract updateData(data: D): Promise<any>
}
export {DeviceActionGroup}

export {Device,DeviceTypes, DeviceActionResponse, DeviceAction};