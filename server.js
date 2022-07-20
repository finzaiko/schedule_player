const Fastify = require("fastify");
const NODE_ENV = "development";
const path = require("path");
const multer = require("fastify-multer");
const { ALLOW_ORIGIN } = require("./src/config/contant");

const logger = {
  development: {
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: "time,pid,hostname",
    },
  },
  production: {
    formatters: {
      level(level) {
        return { level };
      },
    },
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
  },
};

const app = async () => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: logger[NODE_ENV],
  });

  await fastify.register(require("fastify-static"), {
    root: path.join(__dirname, "public"),
  });

  await fastify.register(require("fastify-socket.io"), {
    cors: {
      origin: ALLOW_ORIGIN,
      methods: ["*"],
    },
  });

  await fastify.register(multer.contentParser);

  await fastify.register(require("./src/core/init"));

  await fastify.register(require("./src/gateway/socket.gateway"));

  await fastify.register(require("fastify-cors"), { origin: "*" });
  await fastify.register(require("./src/routes/api"), { prefix: "api/v1" });

  return fastify;
};

module.exports = {
  app,
};
