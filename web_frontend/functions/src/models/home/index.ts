import { Create, Delete, ModelTypes, OperationExecutionChain, Update } from ".."
import { FirestoreDeviceDBAdapter } from "../../firestore/devices";
import { FirestoreHomeDBAdapter } from "../../firestore/home";
import { FirestoreUserDBAdapter } from "../../firestore/user";
import { NoUserError, User, UserNotAdminError } from "../users";

/**
 * Holds the interface for a room. Used in Home.
 * devices are a Map<device_id:string, device_name:string>
 */
interface Room {
    name: string,
    devices: Map<string, string>
}
export { Room }

interface Member {
    name: string,
    admin: boolean
}
export { Member }

class Home {
    /**
     * Creates a home
     * @param id 
     * @param name 
     * @param rooms Array of rooms. Each room has a name and devices. Devices are a map<devices_id, device_name>
     * @param members 
     */
    constructor(public id: string, public name: string, public rooms: Array<Room | null>, public members: Map<string, Member>) { }

    getMemberIDs(): string[] {
        const ids: string[] = []
        this.rooms.forEach(room => {
            room?.devices.forEach((_, device_id) => {
                ids.push(device_id)
            })
        })
        return ids;
    }

    removeDevice(device_id: string) {
        const success: boolean[] = []
        this.rooms.forEach(room => {
            success.push(room ? room.devices.delete(device_id) : false)
        })
        return success.includes(true);
    }

    getRoomNames() {
        const rooms: { name: string, number: number }[] = [];
        this.rooms.forEach((room, num) => { if (room) { rooms.push({ name: room.name, number: num }) } })
        return rooms;
    }
    addDevice(device_id: string, device_name:string, room_no: number) {
        const room = this.rooms[room_no]
        if (room){
            room.devices.set(device_id,device_name)
        } else {
            throw new Error ("Device cannot be added to a room that does not exist")
        }
    }
    renameDevice(device_id: string, new_device_name:string){
        this.rooms.forEach(x=>{
            if(x){
                if (x.devices.has(device_id)){
                    x.devices.set(device_id, new_device_name)
                }
            }
        })
    }
}

export { Home }

class CreateHome extends Create {
    opex: OperationExecutionChain = {
        permission: (uid: string) => {
            console.log(uid)
            // Determine permissions
            return {
                read: async () => {
                    // Read operations from database
                    return {
                        write: () => {
                            //write operations to database
                        }
                    }
                }
            }
        }
    }
    ModelType: ModelTypes = ModelTypes.Home;
    async run(): Promise<any> {
        const members = new Map([[this.user.id, { name: `${this.user.firstname} ${this.user.lastname}`, admin: true }]])
        const homeID = this.homeAdapter.create(new Home("", this.name, [], members))
        this.user.home.set(homeID, this.name)
        this.userAdapter.update(this.user)
    }
    constructor(public name: string,
        public user: User,
        public homeAdapter: FirestoreHomeDBAdapter,
        public userAdapter: FirestoreUserDBAdapter) {
        super()
    }
}

export { CreateHome }

class DeleteHome extends Delete {
    read() {
        throw new Error("Method not implemented.");
    }
    write() {
        throw new Error("Method not implemented.");
    }
    async run(): Promise<void> {
        // Check if user is the admin:
        const mem = this.home.members.get(this.user.id);
        if (!mem) {
            throw new NoUserError("Cannot delete home");
        } else if (!mem.admin) {
            throw new UserNotAdminError("Cannot delete home");
        }

        // For each member of a home, delete the home entry.
        const usrList: User[] = []
        this.home.members.forEach(async (member, id) => {
            const usr = await this.userAdapter.get(id)
            if (usr) {
                usr.home.delete(this.home.id)
                usrList.push(usr)
            }
        })

        // Delete each device in the home
        const devicesPromises = this.home.getMemberIDs().map(id => this.deviceAdapter.get(id))
        const devices = await Promise.all(devicesPromises)

        devices.forEach(device => {
            if (device) {
                device.delete(this.deviceAdapter).read().write();
            }
        })

        // Update each home entry
        usrList.forEach(usr => {
            this.userAdapter.update(usr)
        })

        // Remove home from database
        this.homeAdapter.delete(this.home)
    }
    constructor(public home: Home, public user: User, public homeAdapter: FirestoreHomeDBAdapter, public userAdapter: FirestoreUserDBAdapter, public deviceAdapter: FirestoreDeviceDBAdapter<any>) {
        super()
    }
}
export { DeleteHome }

export abstract class UpdateHome extends Update {
    ModelType: ModelTypes = ModelTypes.Home
    constructor(public home: Home, public dbAdapter: FirestoreHomeDBAdapter) {
        super();
    }
}


export function RemoveDeviceFromHome (home_id: string, device_id: string, dbAdapter: FirestoreHomeDBAdapter){
    return ModifyHome(home_id, dbAdapter, (home:Home)=>{
        home.removeDevice(device_id)
    })
}

export function AddDeviceToHome(home_id: string, device_name: string, room_number:number, dbAdapter: FirestoreHomeDBAdapter) {
    return {
        async read(){
            const home = await dbAdapter.get(home_id)
            if (home instanceof Home) {
                return {
                    write: (device_id:string)=>{
                        home.addDevice(device_id,device_name,room_number)
                        dbAdapter.update(home)
                    }
                }
            } else {
                throw Error("invalid home")
            }
        }
    }

    
}

export function RenameDeviceInRoom(home_id: string, device_id: string, device_name: string, dbAdapter: FirestoreHomeDBAdapter) {    
    return ModifyHome(home_id, dbAdapter, (home:Home)=>{
        home.renameDevice(device_id,device_name);
    })
}


/**
 * Used as a decorator for home object function operations 
 * @param action Some sort of modification to the home object
 * @param home_id 
 * @param dbAdaptor 
 */
function ModifyHome(home_id:string, dbAdapter:FirestoreHomeDBAdapter, action?:{(home:Home):void}) {
    return {
        async read(){
            const home = await dbAdapter.get(home_id)
            if (home instanceof Home) {
                if (typeof(action) === "function"){
                    action(home)
                }
                return {
                    write: (write_action?:{(home:Home):void})=>{
                        if(typeof(write_action) === "function"){
                            write_action(home)
                        }
                        dbAdapter.update(home)
                    }
                }
            } else {
                throw Error("invalid home")
            }
        }
    }
}