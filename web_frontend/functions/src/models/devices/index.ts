import { FirestoreDeviceDBAdapter } from "../../firestore/devices";
import { Update, UpdateAction, ModelTypes, Delete, Create, OperationExecutionChain, Edit } from "../";
import { AddDeviceToHome, RemoveDeviceFromHome, RenameDeviceInRoom } from "../home";
import { FirestoreHomeDBAdapter } from "../../firestore/home";
import Light from "./light";
import Curtain from "./curtain";

enum DeviceTypes {
    Light = 'light',
    Curtain = 'curtain'
}

type Devices = Light|Curtain;

abstract class Device<DeviceStates>{
    private _id: string;
    protected abstract _states: DeviceStates
    private _type: DeviceTypes
    private _homeid: string
    public _userRef: any; //specialData
    abstract converter: FirebaseFirestore.FirestoreDataConverter<any>;
    // abstract actions():any;
    // abstract delete():any;
    constructor(id: string, public name: string, type: DeviceTypes, homeid: string) {
        this._id = id;
        this._type = type;
        this._homeid = homeid;
    }
    public get id(): string {
        return this._id;
    }

    public get type(): DeviceTypes {
        return this._type;
    }

    public get home(): string {
        return this._homeid;
    }

    public get states(): DeviceStates {
        return this._states;
    }

}

interface DeviceActionResponse<D> {
    success: boolean,
    message?: string,
    newState: D,
    IOTAction: string
}

/**
 * Implement a specific device action to be executed on a single device.
 */
interface DeviceAction<D> extends UpdateAction {
    (initialState: D): D;
}

/**
 * Implements an action group which can run a series of actions on a single device.
 */

abstract class DeviceActionGroup<D extends Device<any>> extends Update {
    ModelType: ModelTypes = ModelTypes.Device;
    abstract actions: Array<DeviceAction<D>>;
    async run(): Promise<any> {
        const dbState = this.initialState;
        let IOTState
        try {
            IOTState = await this.getIOT({})
        } catch (error) {
            IOTState = false;
        }
        const initialState = this.resolveState(dbState, IOTState);
        const finalState = this.actions.reduce((state, action) => {
            // return action.do(state)
            return action(state)
        }, initialState)
        await this.updateIOT(finalState) // Some IOT Action
        this.updateData(finalState)
        throw new Error("Method not fully implemented.");
    }
    constructor(public initialState: D, public dbAdapter: FirestoreDeviceDBAdapter<D>) {
        super();
    }
    /**
     * Gets data from IOT device
     * @param options Change this to some IOT options
     * @returns Should be a promise of some IOT return type
     */
    abstract getIOT(options: any): Promise<any>

    /**
     * Resolves the most up-to-date state from the database and the IOT device
     * @param data 
     */
    abstract resolveState(dbData: D, IOTData: any): D;
    /**
     * Sends data to IOT device
     * @param data Change this to some IOT Payload
     * @returns Should be a promise of some IOT return type
     */
    abstract updateIOT(data: D): Promise<any>

    /**
     * Writes data to firestore
     * @param data The firestore payload to write.
     */
    updateData(data: D): any {
        this.dbAdapter.update(data)
    }
}
export { DeviceActionGroup }

class CreateDevice<D extends Device<any>> extends Create {
    opex: OperationExecutionChain = {permission: (uid:string)=>{
        // Determine permissions
        return {
            read: async ()=>{
                // Read operations from database
                const addToHome = await AddDeviceToHome(this.device.home,this.device.name,this.room_number,this.homeAdapter).read()
                return {
                    write: ()=>{
                        //write operations to database
                        const device_id = this.dbAdapter.create(this.device).id
                        addToHome.write(device_id)
                    }
                }
            }
        }
    }}
    ModelType: ModelTypes = ModelTypes.Device;
    async run(user_id:string) {
        // throw new Error("Method not implemented.");
        (await this.opex.permission(user_id).read()).write();
    }
    constructor(public device: D, public room_number: number, public dbAdapter: FirestoreDeviceDBAdapter<D>, public homeAdapter: FirestoreHomeDBAdapter){
        super();
    }
}

export {CreateDevice}

/**
 * Hard deletes a device
 */
abstract class DeleteDevice<D extends Device<any>> extends Delete {
    /**
     * Runs both read and write operations required for delete
     */
    async run() {
        (await this.read()).write()
    }
    /**
     * Runs database read operations required for delete
     */
    async read() {
        const writeRemove = (await RemoveDeviceFromHome(this.device.home, this.device.id, this.homeAdapter).read()).write
        return {
            write: () => {
                writeRemove()
                this.write()
            }
        };
    }
    /**
     * Runs database write operations required for delete
     */
    protected write() {
        this.IOTDelete();
        this.dbDelete()
    }
    private dbDelete() {
        this.dbAdapter.delete(this.device.id)
    }
    protected abstract IOTDelete(): Promise<any> | any;

    constructor(public device: D, public dbAdapter: FirestoreDeviceDBAdapter<D>, public homeAdapter: FirestoreHomeDBAdapter) {
        super()
    }
}

export { DeleteDevice }

abstract class RenameDevice<D extends Devices>  extends Edit {
    ModelType: ModelTypes = ModelTypes.Device
    abstract get(device_id:string):Promise<D>;
    opex: OperationExecutionChain = {permission: (uid:string)=>{
        // Determine permissions
        return {
            read: async ()=>{
                // Read operations from database
                let dev:D;
                if(typeof(this.device) === "string"){
                    dev = await this.get(this.device)
                    if (dev){
                        this.device = dev;
                    } else {
                        throw new Error("Device not found - Cannot rename a device that doesn't exist")
                    }
                }
                this.device.name = this.new_name;
                const renameInHome = await RenameDeviceInRoom(this.device.home,this.device.id,this.new_name,this.homeAdapter).read()
                return {
                    write: ()=>{
                        //write operations to database
                        this.dbAdapter.update(dev)
                        renameInHome.write();
                    }
                }
            }
        }
    }}
    async run(uid:string): Promise<any> {
        (await this.opex.permission(uid).read()).write()
        return
    }
    /**
     * 
     * @param device Device object (D) or Device ID (string)
     * @param dbAdapter 
     * @param homeAdapter 
     */
    constructor(public device: D|string, public new_name:string, public dbAdapter: FirestoreDeviceDBAdapter<D>, public homeAdapter: FirestoreHomeDBAdapter){super()}
}

export {RenameDevice}

export { Device, DeviceTypes, DeviceActionResponse, DeviceAction };