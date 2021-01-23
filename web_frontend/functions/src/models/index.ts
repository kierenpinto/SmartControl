/**
 * CRUD Models
 */

type operationType = 'create'|'read'|'update'|'delete'|'edit'
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

interface OperationExecutionChain {
    permission: {
        (uid:string):{
            read: {
                (argRead?:any): Promise<{
                    write:{
                        (argWrite?:any):any
                    }
                }>
            }
        }
    }
}


export {OperationExecutionChain}

/** Create - CRUD Operation*/
abstract class Create implements Operation {
    operation: operationType = 'create'
    abstract readonly ModelType: ModelTypes;
    abstract run(params:any):Promise<any>|any;
    abstract opex?:OperationExecutionChain
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
    abstract updateData(data:any): Promise<any>|any;
}

interface UpdateAction {
    (initialState:any, modifier:any): any;
}
export{UpdateAction, Update}

/** Edit - Variant of Update (Doesn't need to be preceeded by read) */

abstract class Edit implements Operation {
    operation: operationType = 'edit'
    abstract readonly ModelType: ModelTypes;
    abstract run(arg:any):Promise<any>;
}

export {Edit}

/** Delete - CRUD Operation Must be preceded by a Read*/
abstract class Delete implements Operation {
    operation: operationType = 'delete'
    abstract run():Promise<any>|any;
    abstract read():Promise<any>|any;
    protected abstract write():Promise<any>|any;
}
export {Delete}