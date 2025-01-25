"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("../controller/controller");
const router = (0, express_1.Router)();
router.route('/get-captions').get(controller_1.getCaptions);
exports.default = router;
//# sourceMappingURL=router.js.map