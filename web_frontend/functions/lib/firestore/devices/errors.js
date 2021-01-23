"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoDeviceUserError = void 0;
class NoDeviceUserError extends Error {
    constructor() {
        super();
        this.name = 'NoDeviceUserError';
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoDeviceUserError);
        }
        this.message = "There was no user assignmed to this device. This is a critical failure!";
    }
}
exports.NoDeviceUserError = NoDeviceUserError;
//# sourceMappingURL=errors.js.map