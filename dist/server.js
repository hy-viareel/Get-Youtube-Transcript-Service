"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config/config"));
const app_1 = __importDefault(require("./app"));
const server = app_1.default.listen(config_1.default.PORT);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`Application started on port ${config_1.default.PORT}`);
        console.log(`Server URL: ${config_1.default.SERVER_URL}`);
    }
    catch (error) {
        console.error('Application error:', error);
        server.close((error) => {
            if (error) {
                console.error('Error while closing server:', error);
            }
            process.exit(1);
        });
    }
}))();
//# sourceMappingURL=server.js.map