"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightStates = exports.Light = void 0;
const device_1 = require("./device");
class LightStates {
    constructor(brightness, on) {
        this._brightness = brightness;
        this._on = on;
    }
    set on(val) {
        this._on = val;
    }
    get on() {
        return this._on;
    }
    set brightness(val) {
        this._brightness = val;
    }
    get brightness() {
        return this._brightness;
    }
}
exports.LightStates = LightStates;
class Light extends device_1.Device {
    constructor(id, name, states, userid, userRef) {
        super(id, name, device_1.DeviceTypes.Light, userid);
        this._states = states;
        this._userRef = userRef;
    }
}
exports.Light = Light;
exports.default = Light;
//# sourceMappingURL=light.js.map