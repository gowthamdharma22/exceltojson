"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fs = __importStar(require("fs"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
const exceljs = __importStar(require("exceljs"));
const path = __importStar(require("path"));
const cors_1 = __importDefault(require("@fastify/cors"));
const server = (0, fastify_1.default)();
server.register(multipart_1.default);
server.register(cors_1.default);
server.get("/ping", async (request, reply) => {
    return "pong\n";
});
server.post("/upload", async (req, res) => {
    try {
        const values = [];
        const file = await req.file();
        const mainFile = file.fields.mainFile.value;
        const jsonFile = file.fields.jsonFile.value;
        const methodName = file.fields.methodName.value;
        const workbook = new exceljs.Workbook();
        await workbook.xlsx.read(file.file);
        const currsheet = workbook.getWorksheet(1);
        currsheet.eachRow((row) => {
            row.eachCell((cell, i) => {
                if (!values[i - 1]) {
                    values[i - 1] = [];
                }
                values[i - 1].push(cell.value);
            });
        });
        const result = await updateJSON(values, mainFile, jsonFile, methodName);
        return res.status(200).send(result);
    }
    catch (error) {
        console.error("An error occurred:", error);
        return res.status(404).send(error);
    }
});
async function updateJSON(values, mainFile, jsonFile, methodName) {
    try {
        const filePath = path.join("./config", mainFile, jsonFile);
        const data = await fs.promises.readFile(filePath, "utf-8");
        const hData = JSON.parse(data);
        const dbKeys = Object.keys(hData[methodName]);
        let str = String(dbKeys.slice(-1));
        let index = Number(str.slice(-1));
        for (let i = 0; i < values.length; i++) {
            const key = `dbkey${i + index + 1}`;
            hData[methodName][key] = values[i];
        }
        await fs.promises.writeFile(filePath, JSON.stringify(hData, null, 2));
        return hData[methodName];
    }
    catch (error) {
        throw error;
    }
}
server.listen({ port: 8081 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
