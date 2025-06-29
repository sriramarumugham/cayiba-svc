import * as dotenv from "dotenv";

import Fastify from "fastify";

import cors from "@fastify/cors";

import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";

import app from "./app";

export type AppOptions = {} & Partial<AutoloadPluginOptions>;

const options: AppOptions = {};

const server = Fastify();

dotenv.config();

server.get("/", async (request, reply) => {
  return { message: "Hello, from fastify!" };
});

void server.setErrorHandler(async (error, request, reply) => {
  console.error("Raw Error:", error);
  const isValidationError = !!error.validation;
  if (isValidationError) {
    const errorFields = error?.validation?.map((v) => ({
      field: v.instancePath,
      message: v.message,
    }));

    const response = {
      status: "Bad Request",
      message: "Validation error occurred",
      timestamp: new Date().toISOString(),
      errorSource: "Validation",
      errors: errorFields,
    };

    return reply.status(400).send(response);
  }
  const statusCode = error.statusCode || 500;
  const response = {
    status: "Error",
    message: error.message || "Something went wrong",
    timestamp: new Date().toISOString(),
    errorSource: error.name || "Internal Server Error",
  };
  return reply.status(statusCode).send(response);
});

void server.register(app);

const port = parseInt(process.env.PORT || "4000", 10);

console.log("PORT:", port);

const start = async () => {
  try {
    await server.register(cors, {
      origin: (origin, cb) => {
        // Allow undefined (like Postman or SSR), localhost:5173 (vite default), and your frontend domain
        if (
          !origin ||
          origin === "http://localhost:5173" ||
          origin ===
            "http://yscws8csk4k8swwss8swkc88.145.223.18.190.sslip.io" ||
          origin.includes("145.223.18.190") ||
          origin.includes("sslip.io")
        ) {
          cb(null, true);
        } else {
          console.log("CORS blocked origin:", origin);
          cb(new Error("Not allowed"), false);
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    });

    await server.listen({ port: port, host: "0.0.0.0" });
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`API base URL: http://localhost:${port}/cayiba/api/v1`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
