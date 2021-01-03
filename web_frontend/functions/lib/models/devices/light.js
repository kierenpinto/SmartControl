"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LightActions = exports.LightActionGroup = exports.Light = exports.LightStates = void 0;
const _1 = require(".");
const light_1 = require("../../firestore/devices/light");
class LightStates {
    constructor(brightness = 100, on = false) {
        this.on = on;
        this._brightness = brightness;
    }
    set brightness(val) {
        const value = Number(val);
        if (value < 0 || value > 100) {
            throw new Error(`Brightness set to ${value}. It should be between 0 and 100`);
        }
        this._brightness = value;
    }
    get brightness() {
        return this._brightness;
    }
}
exports.LightStates = LightStates;
/**
 * Model for light device
 */
class Light extends _1.Device {
    constructor(id, name, states, userid) {
        super(id, name, _1.DeviceTypes.Light, userid);
        this.actionGroup = LightActionGroup;
        this.converter = light_1.LightFirestoreConverter;
        this._states = states;
    }
    get states() {
        return this._states;
    }
}
exports.Light = Light;
class LightActionGroup extends _1.DeviceActionGroup {
    constructor(deviceId, actions, dbAdapter, initialState) {
        super(deviceId, dbAdapter, initialState);
        this.dbAdapter = dbAdapter;
        this.actions = actions;
    }
    getIOT(options) {
        console.error('getIOT not implemented');
        // throw new Error('Method not implemented.');
    }
    updateIOT(data) {
        console.error('updateIOT not implemented');
        // throw new Error('Method not implemented.');
        return;
    }
    resolveState(dbData, IOTData) {
        //throw new Error('Method not implemented.');
        return dbData;
    }
}
exports.LightActionGroup = LightActionGroup;
/**
 * Generate on or off action.
 * @param toggle True or false : on and off;
 */
function OnOff(toggle) {
    let Func;
    Func = function (initialState) {
        initialState.states.on = toggle;
        return initialState;
    };
    return Func;
}
/**
 * Generates Brightness Action
 * @param brightness Number between 0 and 100
 */
function Brightness(brightness) {
    let Func;
    Func = function (initialState) {
        initialState.states.brightness = brightness;
        return initialState;
    };
    return Func;
}
const LightActions = {
    OnOff,
    Brightness
};
exports.LightActions = LightActions;
exports.default = Light;
//# sourceMappingURL=light.js.map