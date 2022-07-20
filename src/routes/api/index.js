const apiRoutes = async (app, options) => {
  app.register(require("./test.route"), { prefix: "test" });
  app.register(require("./schedule.route"), { prefix: "schedule" });
  app.register(require("./player.route"), { prefix: "player" });
  app.get("/", async (request, reply) => {
    return {
      message: "API/v1 scope running..",
    };
  });
};

module.exports = apiRoutes;
