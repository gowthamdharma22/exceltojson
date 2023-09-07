import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import path from "path";
import cors from "@fastify/cors";
import Autoload from "@fastify/autoload";

class App {
  private fastifyInstance: FastifyInstance;

  constructor(opts: FastifyServerOptions) {
    this.fastifyInstance = fastify(opts);
    this.initializeRoutes();
  }
  public initializeRoutes() {
    console.log(__dirname);

    this.fastifyInstance.register(Autoload, {
      dir: path.join(__dirname, "hotel"),
      options: { prefix: "/hotel" },
    });
  }
}

export default App;
