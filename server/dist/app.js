"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const path_1 = __importDefault(require("path"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
class App {
    fastifyInstance;
    constructor(opts) {
        this.fastifyInstance = (0, fastify_1.default)(opts);
        this.initializeRoutes();
    }
    initializeRoutes() {
        console.log(__dirname);
        this.fastifyInstance.register(autoload_1.default, {
            dir: path_1.default.join(__dirname, "hotel"),
            options: { prefix: "/hotel" },
        });
    }
}
exports.default = App;
