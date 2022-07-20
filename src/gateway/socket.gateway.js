const SocketService = require("../services/socket.service");

const socketEvent = async (app, options) => {
  const sock = await SocketService.init(app.io);
  return sock;
};

module.exports = socketEvent;
