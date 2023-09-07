import { FastifyRequest, FastifyReply } from "fastify";
import { IGetJson, IGetValue } from "./hotel.dto";
import exceljs from "exceljs";
import fs from "fs";

class HotelController {
  public uploadExcel = async (req: FastifyRequest<{ Body: IGetJson }>, res: FastifyReply) => {
    const { mainFile, jsonFile, methodName } = req.body;
    let values: any[] = [];

    const w = new exceljs.Workbook();
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

  public updateJSON = async (
    values: string[],
    mainFile: string,
    jsonFile: string,
    methodName: string
  ) => {
    const data = await fs.promises.readFile(`./config/${mainFile}/${jsonFile}`, "utf-8");
    const hData = JSON.parse(data);
    // console.log(hData)
    const dbKeys = Object.keys(hData[methodName]);
    console.log(dbKeys);

    let str: string = String(dbKeys.slice(-1));
    let index: number = Number(str.slice(-1));

    for (let i = 0; i < values.length; i++) {
      const key = `dbkey${i + index + 1}`;
      hData[methodName][key] = values[i];
    }
    await fs.promises.writeFile(`./config/${mainFile}/${jsonFile}`, JSON.stringify(hData, null, 2));
  };
}

export default HotelController;
