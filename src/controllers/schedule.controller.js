const ScheduleService = require(`../services/schedule.service`);

class ScheduleController {
  async getAll(request, reply) {
    const data = await ScheduleService.getAll();

    reply
      .code(200)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send(data);
  }

  async create(request, reply) {
    const data = await ScheduleService.save(request.body);

    reply
      .code(201)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send(data);
  }

  async update(request, reply) {
    await ScheduleService.save(request.body, request.params.id);
    reply
      .code(204)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send({ status: true, message: "Updated" });
  }

  async remove(request, reply) {
    await ScheduleService.delete(request.params.id);
    reply
      .code(204)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send({ status: true, message: "Removed" });
  }
}

module.exports = new ScheduleController();
