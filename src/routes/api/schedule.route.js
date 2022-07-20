const ScheduleController = require("../../controllers/schedule.controller");

module.exports = async (fastify) => {
  fastify.get(`/`, ScheduleController.getAll);
  fastify.post(`/`, ScheduleController.create);
  fastify.delete(`/:id`, ScheduleController.remove);
  fastify.put(`/:id`, ScheduleController.update);
};
