"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Curtain = void 0;
const _1 = require(".");
/**
 * Represent the current curtain states
 */
class CurtainStates {
    constructor(openPercent) {
        this._openPercent = openPercent;
    }
    get openPercent() {
        return this._openPercent;
    }
    get openPercentString() {
        return String(this._openPercent);
    }
}
/**
 * Represents a curtain object
 */
class Curtain extends _1.Device {
    constructor(id, name, states, type, user) {
        super(id, name, type, user);
        this._states = states;
    }
    get states() {
        return this._states;
    }
}
exports.Curtain = Curtain;
exports.default = Curtain;
//# sourceMappingURL=curtain.js.map