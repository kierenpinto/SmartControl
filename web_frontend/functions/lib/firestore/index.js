"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRef = exports.usersRef = exports.deviceRef = exports.db = void 0;
const firebase_common_1 = require("../firebase_common");
const db = firebase_common_1.admin.firestore(); // Init Firestore
exports.db = db;
const deviceRef = db.collection("devices");
exports.deviceRef = deviceRef;
const usersRef = db.collection("users");
exports.usersRef = usersRef;
const homeRef = db.collection("homeRef");
exports.homeRef = homeRef;
//# sourceMappingURL=index.js.map