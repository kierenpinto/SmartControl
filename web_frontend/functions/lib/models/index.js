"use strict";
/**
 * CRUD Models
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Update = exports.Read = exports.Create = exports.ModelTypes = void 0;
var ModelTypes;
(function (ModelTypes) {
    ModelTypes["Device"] = "DEVICE";
    ModelTypes["User"] = "USER";
})(ModelTypes || (ModelTypes = {}));
exports.ModelTypes = ModelTypes;
/**************** Create ******************/
class Create {
    constructor() {
        this.operation = 'create';
    }
}
exports.Create = Create;
/**************** Read ******************/
class Read {
    constructor() {
        this.operation = 'read';
    }
}
exports.Read = Read;
/**************** Update ******************/
/**
 * Must be preceded by a Read
 */
class Update {
    constructor() {
        this.operation = 'update';
    }
}
exports.Update = Update;
/**************** Delete ******************/
/**
 * Must be preceded by a Read
 */
class Delete {
    constructor() {
        this.operation = 'delete';
    }
}
exports.Delete = Delete;
//# sourceMappingURL=index.js.map