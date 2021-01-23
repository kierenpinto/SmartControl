import { Create, Delete, ModelTypes, OperationExecutionChain } from "..";
import { FirestoreUserDBAdapter } from "../../firestore/user";

class User {
    /**
     * 
     * @param id ID (Primary Key Field or Document ID)
     * @param firstname User's firstname
     * @param lastname User's last name
     * @param home home's Document ID, household name
     */
    constructor(public id:string, public firstname:string, public lastname:string, public home:Map<string,string> ){}
}
export {User}

class CreateUser extends Create {
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
    async run(uid:string): Promise<any> {
        this.userAdapter.create(new User(uid, this.firstname,this.lastname,new Map()))
    }
    constructor(public firstname:string, 
        public lastname:string,
        public userAdapter: FirestoreUserDBAdapter){
        super()
    }
}

export {CreateUser}

class DeleteUser extends Delete {
    run() {
        this.read()
        this.write()
    }
    read() {
        console.log("Delete user not implemented")
        return {write:this.write}
    }
    protected write() {
        throw new Error("Method not implemented.");
    }
}

export {DeleteUser}

class UserNotAdminError extends Error {
    constructor(message?:string){
        super();
        this.name = 'UserNotAdminError'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserNotAdminError)
        }
        this.message = "This user is not an admin. " + (message?message:"")
    }
}
export { UserNotAdminError }

class NoUserError extends Error {
    constructor(message?:string){
        super();
        this.name = 'NoUserError'
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserNotAdminError)
        }
        this.message = "There is no user. " + (message?message:"")
    }
}
export { NoUserError }