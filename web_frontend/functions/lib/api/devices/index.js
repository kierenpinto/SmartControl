"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
router.get("/", function (req, res) {
    res.status(200).json({ 'hi': 'bye' });
});
exports.default = router;
//# sourceMappingURL=index.js.map