import HotelController from "./hotel.controller";
import { IRouteOptions } from "../interface/fastifyinterface";
import { API_METHODS } from "interface/api.interface";

const hotelcontroller = new HotelController();

const hotelRoutes: IRouteOptions<{
  Params: any;
  Body: any;
  Querystring: any;
}>[] = [
    {
        url:'/upload',
        handler:hotelcontroller.uploadExcel,
        preHandler:[],
        method:API_METHODS.POST
    }
];

export default hotelRoutes;
