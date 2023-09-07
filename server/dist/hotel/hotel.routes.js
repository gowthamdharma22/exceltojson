"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hotel_controller_1 = __importDefault(require("./hotel.controller"));
const api_interface_1 = require("interface/api.interface");
const hotelcontroller = new hotel_controller_1.default();
const hotelRoutes = [
    {
        url: '/upload',
        handler: hotelcontroller.uploadExcel,
        preHandler: [],
        method: api_interface_1.API_METHODS.POST
    }
];
exports.default = hotelRoutes;
