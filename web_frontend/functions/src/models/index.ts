/**
 * CRUD Models
 */

type operationType = 'create'|'read'|'update'|'delete'
enum ModelTypes {
    Device = "DEVICE",
    User = "USER",
    Home = "HOME"
}
export {ModelTypes}
interface Operation {
    operation: operationType,
}
interface DatabaseAdapter {
    get:  {
        (config:any):any
    },
    update: {
        (config:any):any
    },
    create: {
        (config:any):any
    },
    delete: {
        (config:any):any
    }
}
export {DatabaseAdapter}

/** Create - CRUD Operation*/
abstract class Create implements Operation {
    operation: operationType = 'create'
    abstract readonly ModelType: ModelTypes;
    abstract run():Promise<any>;
}

export {Create}
/** Read - CRUD Operation*/
abstract class Read implements Operation {
    operation: operationType = 'read'
    abstract readonly ModelType: ModelTypes;
    abstract dbAdapter: DatabaseAdapter;
    abstract run():Promise<any>;

}
export {Read}

/** Update - CRUD Operation Must be preceded by a Read*/
abstract class Update implements Operation {
    operation: operationType = 'update'
    abstract readonly ModelType: ModelTypes;
    abstract actions: Array<UpdateAction>;
    abstract dbAdapter: DatabaseAdapter;
    abstract run():Promise<any>;
    abstract updateData(data:any): Promise<any>;
}

interface UpdateAction {
    (initialState:any, modifier:any): any;
}
export{UpdateAction, Update}

/** Delete - CRUD Operation Must be preceded by a Read*/
abstract class Delete implements Operation {
    operation: operationType = 'delete'
    abstract run():Promise<any>;
}
export {Delete}