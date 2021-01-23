"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoUserError = exports.UserNotAdminError = exports.DeleteUser = exports.CreateUser = exports.User = void 0;
const __1 = require("..");
class User {
    /**
     *
     * @param id ID (Primary Key Field or Document ID)
     * @param firstname User's firstname
     * @param lastname User's last name
     * @param home home's Document ID, household name
     */
    constructor(id, firstname, lastname, home) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.home = home;
    }
}
exports.User = User;
class CreateUser extends __1.Create {
    constructor(firstname, lastname, userAdapter) {
        super();
        this.firstname = firstname;
        this.lastname = lastname;
        this.userAdapter = userAdapter;
        this.opex = {
            permission: (uid) => {
                console.log(uid);
                // Determine permissions
                return {
                    read: async () => {
                        // Read operations from database
                        return {
                            write: () => {
                                //write operations to database
                            }
                        };
                    }
                };
            }
        };
        this.ModelType = __1.ModelTypes.Home;
    }
    async run(uid) {
        this.userAdapter.create(new User(uid, this.firstname, this.lastname, new Map()));
    }
}
exports.CreateUser = CreateUser;
class DeleteUser extends __1.Delete {
    run() {
        this.read();
        this.write();
    }
    read() {
        console.log("Delete user not implemented");
        return { write: this.write };
    }
    write() {
        throw new Error("Method not implemented.");
    }
}
exports.DeleteUser = DeleteUser;
class UserNotAdminError extends Error {
    constructor(message) {
        super();
        this.name = 'UserNotAdminError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserNotAdminError);
        }
        this.message = "This user is not an admin. " + (message ? message : "");
    }
}
exports.UserNotAdminError = UserNotAdminError;
class NoUserError extends Error {
    constructor(message) {
        super();
        this.name = 'NoUserError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UserNotAdminError);
        }
        this.message = "There is no user. " + (message ? message : "");
    }
}
exports.NoUserError = NoUserError;
//# sourceMappingURL=index.js.map