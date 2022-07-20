const TestController = require("../../controllers/test.controller");

module.exports = async (fastify) => {
  fastify.get(`/`, TestController.addSchedule);
};
