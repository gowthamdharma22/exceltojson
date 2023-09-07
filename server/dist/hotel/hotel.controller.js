"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceljs_1 = __importDefault(require("exceljs"));
const fs_1 = __importDefault(require("fs"));
class HotelController {
    uploadExcel = async (req, res) => {
        const { mainFile, jsonFile, methodName } = req.body;
        let values = [];
        const w = new exceljs_1.default.Workbook();
        await w.xlsx.readFile("./files/dummy2.xlsx");
        const currsheet = w.getWorksheet(1);
        currsheet.eachRow((row) => {
            row.eachCell((cell, i) => {
                if (!values[i - 1]) {
                    values[i - 1] = [];
                }
                values[i - 1].push(cell.value);
            });
        });
        const result = await this.updateJSON(values, mainFile, jsonFile, methodName);
        res.status(200).send(result);
    };
    updateJSON = async (values, mainFile, jsonFile, methodName) => {
        const data = await fs_1.default.promises.readFile(`./config/${mainFile}/${jsonFile}`, "utf-8");
        const hData = JSON.parse(data);
        // console.log(hData)
        const dbKeys = Object.keys(hData[methodName]);
        console.log(dbKeys);
        let str = String(dbKeys.slice(-1));
        let index = Number(str.slice(-1));
        for (let i = 0; i < values.length; i++) {
            const key = `dbkey${i + index + 1}`;
            hData[methodName][key] = values[i];
        }
        await fs_1.default.promises.writeFile(`./config/${mainFile}/${jsonFile}`, JSON.stringify(hData, null, 2));
    };
}
exports.default = HotelController;
