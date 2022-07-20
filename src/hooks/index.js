const fastifyPlugin = require("fastify-plugin");

module.exports = fastifyPlugin((fastify, options, next) => {
  fastify.addHook("onRequest", async (request, reply) => {
    try {
      if (!/\/auth.*|\/v1$/.test(request.url)) {
        //await request.jwtVerify();
      }
    } catch (err) {
      reply.send(err);
    }
  });

  next();
});
