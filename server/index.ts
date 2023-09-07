import fastify from "fastify";
import * as fs from "fs";
import multipart from "@fastify/multipart";
import * as exceljs from "exceljs";
import * as path from "path";
import cors from "@fastify/cors";

const server = fastify();
server.register(multipart);
server.register(cors);

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.post("/upload", async (req, res) => {
  try {
    const values: any[] = [];
    const file: any = await req.file();
    const mainFile: string = file.fields.mainFile.value;
    const jsonFile: string = file.fields.jsonFile.value;
    const methodName: string = file.fields.methodName.value;

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
  } catch (error) {
    console.error("An error occurred:", error);
    return res.status(404).send(error);
  }
});

async function updateJSON(
  values: string[],
  mainFile: string,
  jsonFile: string,
  methodName: string
) {
  try {
    const filePath = path.join("./config", mainFile, jsonFile);
    const data = await fs.promises.readFile(filePath, "utf-8");
    const hData = JSON.parse(data);

    const dbKeys = Object.keys(hData[methodName]);

    let str: string = String(dbKeys.slice(-1));
    let index: number = Number(str.slice(-1));

    for (let i = 0; i < values.length; i++) {
      const key = `dbkey${i + index + 1}`;
      hData[methodName][key] = values[i];
    }
    await fs.promises.writeFile(filePath, JSON.stringify(hData, null, 2));

    return hData[methodName];
  } catch (error) {
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
