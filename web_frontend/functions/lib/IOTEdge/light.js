"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLightIOTDevice = void 0;
const common_1 = require("./common");
/**
 * Specific light update operation
 * @param {Device ID } id
 * @param {State for Device to be changed to} new_state
 */
function updateLightIOTDevice(light) {
    const new_state = new Map();
    const id = light.id;
    new_state.set('brightness', light.states.brightness);
    new_state.set('on', light.states.on);
    return common_1.default(id, new_state);
}
exports.updateLightIOTDevice = updateLightIOTDevice;
exports.default = updateLightIOTDevice;
//# sourceMappingURL=light.js.map