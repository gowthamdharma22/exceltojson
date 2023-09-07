"use client";
import React, { useState } from "react";
import "./style.css";
import axios from "axios";

function page() {
  const [value, setValue] = useState({
    mainFile: "",
    jsonFile: "",
    methodName: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("file", file as unknown as string);
    formdata.append("mainFile", value.mainFile);
    formdata.append("jsonFile", value.jsonFile);
    formdata.append("methodName", value.methodName);

    try {
      const res =  axios.post("http://127.0.0.1:8081/upload", formdata);
      console.log(res.then((value) => setData(value.data)));
    } catch (error) {
      console.log(error);
    } finally {
      setValue({
        mainFile: "",
        jsonFile: "",
        methodName: "",
      });
    }
  };

  return (
    <div className="main">
      <div className="center">
        <form className="form" onSubmit={handleSubmit}>
          <div className="content">
            <label>Select the Service : </label>
            <select
              onChange={(e) => setValue({ ...value, mainFile: e.target.value })}
              value={value.mainFile}
            >
              <option value="nothing" selected>
                Select an option
              </option>
              <option value="content-services">Content-Services</option>
            </select>
          </div>
          <div className="content">
            <label>Select the JSON : </label>
            <select
              onChange={(e) => setValue({ ...value, jsonFile: e.target.value })}
              value={value.jsonFile}
            >
              <option value="nothing" selected>
                Select an option
              </option>
              <option value="hotels.json">Hotel</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </div>
          <div className="content">
            <label>Select the Service : </label>
            <select
              onChange={(e) => setValue({ ...value, methodName: e.target.value })}
              value={value.methodName}
            >
              <option value="nothing" selected>
                Select an option
              </option>
              <option value="create">Create</option>
              <option value="update">Update</option>
            </select>
          </div>
          <div className="content">
            <label>Upload the Excel file : </label>
            <input
              type="file"
              accept=".xlsx"
              required
              onChange={(e) => {
                setFile(e.target.files instanceof FileList ? e.target.files[0] : null);
              }}
            />
          </div>
          <div className="btn-cont">
            <button className="btn" type="submit">
              Upload
            </button>
            <button
              className="btn"
              onClick={() => {
                setValue({
                  mainFile: "",
                  jsonFile: "",
                  methodName: "",
                });
              }}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default page;
