/**
 * Parent interface for all actions
 */

enum ModelTypes {
    Device = "DEVICE",
    User = "USER"
}
export {ModelTypes}

/**
 * Holds the underlying processes for a read-only query to be fullfilled on a model. 
 */
// interface ModelQuery{
//     ModelType: ModelTypes;
//     getData(transaction:FirebaseFirestore.Transaction, data:any): Promise<any>;
//     run():Promise<any>;
// }
// export {ModelQuery}

// /**
//  * Holds mutliple query that are run together in an query group.
//  */
// interface QueryGroup {
//     readonly ModelType: ModelTypes;
//     readonly FirestoreTransaction: FirebaseFirestore.Transaction;
//     actions: ModelQuery;
//     run():Promise<any>;
// }
// export {QueryGroup}

/**
 * Holds the underlying processes for an action to be fullfilled on a model. 
 */
// interface ModelAction {
//     readonly ModelType: ModelTypes;
//     singular:boolean; // must be run by itself
// }
interface ModelAction {
    (initialState:any, modifier:any): any;
}
export{ModelAction}

/**
 * Holds mutliple actions that are run together in an action group.
 */
interface ActionGroup {
    readonly ModelType: ModelTypes;
    readonly FirestoreTransaction: FirebaseFirestore.Transaction;
    actions: Array<ModelAction>;
    run():Promise<any>;
    getData(options:any): Promise<any>;
    updateData(data:any): Promise<any>;
}
export {ActionGroup}
