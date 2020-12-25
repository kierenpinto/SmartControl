"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeLight = void 0;
function executeLight(light, instructions) {
    instructions.forEach(execute => {
        if (execute.params) {
            switch (execute.command) {
                case "action.devices.commands.OnOff":
                    light.states.on = execute.params.on;
                    break;
                case "action.devices.commands.BrightnessAbsolute":
                    // Change Brighness
                    light.states.brightness = execute.params.brightness;
                    break;
                case "action.devices.commands.ColorAbsolute":
                    // Change Color
                    /*
                    const name = execute.params.color.name;
                    const RGB = execute.params.color.spectrumRGB;
                    */
                    throw new Error("Color Not Implemented Yet");
                    break;
                default:
                    //throw exception
                    throw new Error("Invalid Parameter");
            }
        }
    });
    return light;
}
exports.executeLight = executeLight;
//# sourceMappingURL=light.js.map