import { FastifyInstance } from "fastify";
import hotelRoutes from "./hotel.routes";

export default async (fastify: FastifyInstance) => {
	for (const hotelRoute of hotelRoutes) {
		fastify.route(hotelRoute);
	}
};
