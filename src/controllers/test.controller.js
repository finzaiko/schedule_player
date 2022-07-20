const SocketService = require(`../services/socket.service`);

class TestController {
  async addSchedule(request, reply) {
    const a = await SocketService.emit("hello", "test dari URLLL");
    console.log("a", a);

    // SocketService.emit("hello", "Test dari URLLL");

    reply
      .code(200)
      .header(`Content-Type`, `application/json; charset=utf-8`)
      .send({ status: "Schedule added" });
  }
}

module.exports = new TestController();
