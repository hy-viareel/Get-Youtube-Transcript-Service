"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const responseMessage_1 = require("../constants/responseMessage");
const config_1 = __importDefault(require("../config/config"));
const application_1 = require("../constants/application");
exports.default = (err, req, errorStatusCode = 500) => {
    const errorObj = {
        success: false,
        statusCode: errorStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: err instanceof Error ? err.message || responseMessage_1.responseMessage.SOMETHING_WENT_WRONG : responseMessage_1.responseMessage.SOMETHING_WENT_WRONG,
        data: null,
        trace: err instanceof Error ? err.stack : null
    };
    console.error(`CONTROLLER_ERROR`, {
        meta: errorObj
    });
    if (config_1.default.ENV == application_1.EApplicationEnviroment.PRODUCTION) {
        delete errorObj.request.ip;
        delete errorObj.trace;
    }
    return errorObj;
};
//# sourceMappingURL=errorObject.js.map