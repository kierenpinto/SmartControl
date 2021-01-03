"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTypes = exports.Device = exports.DeviceActionGroup = void 0;
const lodash_1 = require("lodash");
const __1 = require("../");
var DeviceTypes;
(function (DeviceTypes) {
    DeviceTypes["Light"] = "light";
    DeviceTypes["Curtain"] = "curtain";
})(DeviceTypes || (DeviceTypes = {}));
exports.DeviceTypes = DeviceTypes;
class Device {
    constructor(id, name, type, userid) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._userid = userid;
    }
    get name() {
        if (lodash_1.isNull(this._name)) {
            // need to implment update
            this._name = 'Untitled';
        }
        return this._name;
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
    get user() {
        return this._userid;
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
    constructor(deviceId, dbAdapter, initialState) {
        super();
        this.deviceId = deviceId;
        this.dbAdapter = dbAdapter;
        this.initialState = initialState;
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
//# sourceMappingURL=index.js.map