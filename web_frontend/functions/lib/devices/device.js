"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceActions = exports.DeviceActionResponse = exports.DeviceTypes = exports.Device = void 0;
const lodash_1 = require("lodash");
// enum DeviceTypes {
//     Light = "LIGHT",
//     Curtain = "CURTAIN"
// }
var DeviceTypes;
(function (DeviceTypes) {
    DeviceTypes[DeviceTypes["Light"] = 0] = "Light";
    DeviceTypes[DeviceTypes["Curtain"] = 1] = "Curtain";
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
// interface DeviceAction{
//     name:string;
//     value:any;
// }
class DeviceActionResponse {
    constructor(success, message) {
        if (message !== undefined) {
            this.message = message;
        }
        this.success = success;
    }
}
exports.DeviceActionResponse = DeviceActionResponse;
/**
 * Implement Specific Device Actions in a chain to be executed on a single device.
 */
class DeviceActions {
    constructor() {
        this.actions = new Map;
    }
}
exports.DeviceActions = DeviceActions;
//# sourceMappingURL=device.js.map