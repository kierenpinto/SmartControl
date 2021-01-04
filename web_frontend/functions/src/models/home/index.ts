import { Create, Delete, ModelTypes } from ".."

/**
 * Holds the interface for a room. Used in Home.
 * devices are a Map<device_id:string, device_name:string>
 */
interface Room{
    name:string,
    devices:Map<string,string> 
}
export {Room}

interface Member {
    name: string,
    admin: boolean
}

class Home {
    /**
     * Creates a home
     * @param id 
     * @param name 
     * @param rooms Array of rooms. Each room has a name and devices. Devices are a map<devices_id, device_name>
     * @param members 
     */
    constructor(public id:string, public name:string, public rooms:Array<Room|null>, public members:Map<string,Member>){}
}

export {Home}

class CreateHome extends Create {
    ModelType: ModelTypes = ModelTypes.Home;
    run(): Promise<any> {
        throw new Error("Method not implemented.")
    }
    constructor(public name:string, public userid:string){
        super()
    }
}

export {CreateHome}

class DeleteHome extends Delete {
    run(): Promise<any> {
        throw new Error("Method not implemented.");
    }
    constructor(public home:Home){
        super()
    }
}
export {DeleteHome}