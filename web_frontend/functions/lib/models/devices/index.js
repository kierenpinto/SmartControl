"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTypes = exports.Device = exports.RenameDevice = exports.DeleteDevice = exports.CreateDevice = exports.DeviceActionGroup = void 0;
const __1 = require("../");
const home_1 = require("../home");
var DeviceTypes;
(function (DeviceTypes) {
    DeviceTypes["Light"] = "light";
    DeviceTypes["Curtain"] = "curtain";
})(DeviceTypes || (DeviceTypes = {}));
exports.DeviceTypes = DeviceTypes;
class Device {
    // abstract actions():any;
    // abstract delete():any;
    constructor(id, name, type, homeid) {
        this.name = name;
        this._id = id;
        this._type = type;
        this._homeid = homeid;
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
    get home() {
        return this._homeid;
    }
    get states() {
        return this._states;
    }
}
exports.Device = Device;
/**
 * Implements an action group which can run a series of actions on a single device.
 */
class DeviceActionGroup extends __1.Update {
    constructor(initialState, dbAdapter) {
        super();
        this.initialState = initialState;
        this.dbAdapter = dbAdapter;
        this.ModelType = __1.ModelTypes.Device;
    }
    async run() {
        const dbState = this.initialState;
        let IOTState;
        try {
            IOTState = await this.getIOT({});
        }
        catch (error) {
            IOTState = false;
        }
        const initialState = this.resolveState(dbState, IOTState);
        const finalState = this.actions.reduce((state, action) => {
            // return action.do(state)
            return action(state);
        }, initialState);
        await this.updateIOT(finalState); // Some IOT Action
        this.updateData(finalState);
        throw new Error("Method not fully implemented.");
    }
    /**
     * Writes data to firestore
     * @param data The firestore payload to write.
     */
    updateData(data) {
        this.dbAdapter.update(data);
    }
}
exports.DeviceActionGroup = DeviceActionGroup;
class CreateDevice extends __1.Create {
    constructor(device, room_number, dbAdapter, homeAdapter) {
        super();
        this.device = device;
        this.room_number = room_number;
        this.dbAdapter = dbAdapter;
        this.homeAdapter = homeAdapter;
        this.opex = { permission: (uid) => {
                // Determine permissions
                return {
                    read: async () => {
                        // Read operations from database
                        const addToHome = await home_1.AddDeviceToHome(this.device.home, this.device.name, this.room_number, this.homeAdapter).read();
                        return {
                            write: () => {
                                //write operations to database
                                const device_id = this.dbAdapter.create(this.device).id;
                                addToHome.write(device_id);
                            }
                        };
                    }
                };
            } };
        this.ModelType = __1.ModelTypes.Device;
    }
    async run(user_id) {
        // throw new Error("Method not implemented.");
        (await this.opex.permission(user_id).read()).write();
    }
}
exports.CreateDevice = CreateDevice;
/**
 * Hard deletes a device
 */
class DeleteDevice extends __1.Delete {
    constructor(device, dbAdapter, homeAdapter) {
        super();
        this.device = device;
        this.dbAdapter = dbAdapter;
        this.homeAdapter = homeAdapter;
    }
    /**
     * Runs both read and write operations required for delete
     */
    async run() {
        (await this.read()).write();
    }
    /**
     * Runs database read operations required for delete
     */
    async read() {
        const writeRemove = (await home_1.RemoveDeviceFromHome(this.device.home, this.device.id, this.homeAdapter).read()).write;
        return {
            write: () => {
                writeRemove();
                this.write();
            }
        };
    }
    /**
     * Runs database write operations required for delete
     */
    write() {
        this.IOTDelete();
        this.dbDelete();
    }
    dbDelete() {
        this.dbAdapter.delete(this.device.id);
    }
}
exports.DeleteDevice = DeleteDevice;
class RenameDevice extends __1.Edit {
    /**
     *
     * @param device Device object (D) or Device ID (string)
     * @param dbAdapter
     * @param homeAdapter
     */
    constructor(device, new_name, dbAdapter, homeAdapter) {
        super();
        this.device = device;
        this.new_name = new_name;
        this.dbAdapter = dbAdapter;
        this.homeAdapter = homeAdapter;
        this.ModelType = __1.ModelTypes.Device;
        this.opex = { permission: (uid) => {
                // Determine permissions
                return {
                    read: async () => {
                        // Read operations from database
                        let dev;
                        if (typeof (this.device) === "string") {
                            dev = await this.get(this.device);
                            if (dev) {
                                this.device = dev;
                            }
                            else {
                                throw new Error("Device not found - Cannot rename a device that doesn't exist");
                            }
                        }
                        this.device.name = this.new_name;
                        const renameInHome = await home_1.RenameDeviceInRoom(this.device.home, this.device.id, this.new_name, this.homeAdapter).read();
                        return {
                            write: () => {
                                //write operations to database
                                this.dbAdapter.update(dev);
                                renameInHome.write();
                            }
                        };
                    }
                };
            } };
    }
    async run(uid) {
        (await this.opex.permission(uid).read()).write();
        return;
    }
}
exports.RenameDevice = RenameDevice;
//# sourceMappingURL=index.js.map