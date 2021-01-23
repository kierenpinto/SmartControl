"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameDeviceInRoom = exports.AddDeviceToHome = exports.RemoveDeviceFromHome = exports.UpdateHome = exports.DeleteHome = exports.CreateHome = exports.Home = void 0;
const __1 = require("..");
const users_1 = require("../users");
class Home {
    /**
     * Creates a home
     * @param id
     * @param name
     * @param rooms Array of rooms. Each room has a name and devices. Devices are a map<devices_id, device_name>
     * @param members
     */
    constructor(id, name, rooms, members) {
        this.id = id;
        this.name = name;
        this.rooms = rooms;
        this.members = members;
    }
    getMemberIDs() {
        const ids = [];
        this.rooms.forEach(room => {
            room?.devices.forEach((_, device_id) => {
                ids.push(device_id);
            });
        });
        return ids;
    }
    removeDevice(device_id) {
        const success = [];
        this.rooms.forEach(room => {
            success.push(room ? room.devices.delete(device_id) : false);
        });
        return success.includes(true);
    }
    getRoomNames() {
        const rooms = [];
        this.rooms.forEach((room, num) => { if (room) {
            rooms.push({ name: room.name, number: num });
        } });
        return rooms;
    }
    addDevice(device_id, device_name, room_no) {
        const room = this.rooms[room_no];
        if (room) {
            room.devices.set(device_id, device_name);
        }
        else {
            throw new Error("Device cannot be added to a room that does not exist");
        }
    }
    renameDevice(device_id, new_device_name) {
        this.rooms.forEach(x => {
            if (x) {
                if (x.devices.has(device_id)) {
                    x.devices.set(device_id, new_device_name);
                }
            }
        });
    }
}
exports.Home = Home;
class CreateHome extends __1.Create {
    constructor(name, user, homeAdapter, userAdapter) {
        super();
        this.name = name;
        this.user = user;
        this.homeAdapter = homeAdapter;
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
    async run() {
        const members = new Map([[this.user.id, { name: `${this.user.firstname} ${this.user.lastname}`, admin: true }]]);
        const homeID = this.homeAdapter.create(new Home("", this.name, [], members));
        this.user.home.set(homeID, this.name);
        this.userAdapter.update(this.user);
    }
}
exports.CreateHome = CreateHome;
class DeleteHome extends __1.Delete {
    constructor(home, user, homeAdapter, userAdapter, deviceAdapter) {
        super();
        this.home = home;
        this.user = user;
        this.homeAdapter = homeAdapter;
        this.userAdapter = userAdapter;
        this.deviceAdapter = deviceAdapter;
    }
    read() {
        throw new Error("Method not implemented.");
    }
    write() {
        throw new Error("Method not implemented.");
    }
    async run() {
        // Check if user is the admin:
        const mem = this.home.members.get(this.user.id);
        if (!mem) {
            throw new users_1.NoUserError("Cannot delete home");
        }
        else if (!mem.admin) {
            throw new users_1.UserNotAdminError("Cannot delete home");
        }
        // For each member of a home, delete the home entry.
        const usrList = [];
        this.home.members.forEach(async (member, id) => {
            const usr = await this.userAdapter.get(id);
            if (usr) {
                usr.home.delete(this.home.id);
                usrList.push(usr);
            }
        });
        // Delete each device in the home
        const devicesPromises = this.home.getMemberIDs().map(id => this.deviceAdapter.get(id));
        const devices = await Promise.all(devicesPromises);
        devices.forEach(device => {
            if (device) {
                device.delete(this.deviceAdapter).read().write();
            }
        });
        // Update each home entry
        usrList.forEach(usr => {
            this.userAdapter.update(usr);
        });
        // Remove home from database
        this.homeAdapter.delete(this.home);
    }
}
exports.DeleteHome = DeleteHome;
class UpdateHome extends __1.Update {
    constructor(home, dbAdapter) {
        super();
        this.home = home;
        this.dbAdapter = dbAdapter;
        this.ModelType = __1.ModelTypes.Home;
    }
}
exports.UpdateHome = UpdateHome;
function RemoveDeviceFromHome(home_id, device_id, dbAdapter) {
    return ModifyHome(home_id, dbAdapter, (home) => {
        home.removeDevice(device_id);
    });
}
exports.RemoveDeviceFromHome = RemoveDeviceFromHome;
function AddDeviceToHome(home_id, device_name, room_number, dbAdapter) {
    return {
        async read() {
            const home = await dbAdapter.get(home_id);
            if (home instanceof Home) {
                return {
                    write: (device_id) => {
                        home.addDevice(device_id, device_name, room_number);
                        dbAdapter.update(home);
                    }
                };
            }
            else {
                throw Error("invalid home");
            }
        }
    };
}
exports.AddDeviceToHome = AddDeviceToHome;
function RenameDeviceInRoom(home_id, device_id, device_name, dbAdapter) {
    return ModifyHome(home_id, dbAdapter, (home) => {
        home.renameDevice(device_id, device_name);
    });
}
exports.RenameDeviceInRoom = RenameDeviceInRoom;
/**
 * Used as a decorator for home object function operations
 * @param action Some sort of modification to the home object
 * @param home_id
 * @param dbAdaptor
 */
function ModifyHome(home_id, dbAdapter, action) {
    return {
        async read() {
            const home = await dbAdapter.get(home_id);
            if (home instanceof Home) {
                if (typeof (action) === "function") {
                    action(home);
                }
                return {
                    write: (write_action) => {
                        if (typeof (write_action) === "function") {
                            write_action(home);
                        }
                        dbAdapter.update(home);
                    }
                };
            }
            else {
                throw Error("invalid home");
            }
        }
    };
}
//# sourceMappingURL=index.js.map