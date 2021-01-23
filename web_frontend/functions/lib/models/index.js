"use strict";
/**
 * CRUD Models
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delete = exports.Edit = exports.Update = exports.Read = exports.Create = exports.ModelTypes = void 0;
var ModelTypes;
(function (ModelTypes) {
    ModelTypes["Device"] = "DEVICE";
    ModelTypes["User"] = "USER";
    ModelTypes["Home"] = "HOME";
})(ModelTypes || (ModelTypes = {}));
exports.ModelTypes = ModelTypes;
/** Create - CRUD Operation*/
class Create {
    constructor() {
        this.operation = 'create';
    }
}
exports.Create = Create;
/** Read - CRUD Operation*/
class Read {
    constructor() {
        this.operation = 'read';
    }
}
exports.Read = Read;
/** Update - CRUD Operation Must be preceded by a Read*/
class Update {
    constructor() {
        this.operation = 'update';
    }
}
exports.Update = Update;
/** Edit - Variant of Update (Doesn't need to be preceeded by read) */
class Edit {
    constructor() {
        this.operation = 'edit';
    }
}
exports.Edit = Edit;
/** Delete - CRUD Operation Must be preceded by a Read*/
class Delete {
    constructor() {
        this.operation = 'delete';
    }
}
exports.Delete = Delete;
//# sourceMappingURL=index.js.map