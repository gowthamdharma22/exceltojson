"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hotel_routes_1 = __importDefault(require("./hotel.routes"));
exports.default = async (fastify) => {
    for (const hotelRoute of hotel_routes_1.default) {
        fastify.route(hotelRoute);
    }
};
