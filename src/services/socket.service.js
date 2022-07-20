class SocketService {
  async init(io) {
    io.on("connection", async (socket) => {
      console.log("client connected= socket.id", socket.id);
      socket.emit("zkoinit", "socket server init..");
    });
    this.socketIo = io;
    return true;
  }

  async emit(event, data) {
    this.socketIo.emit(event, data);
  }

  static async ioEmit(flag, data) {
    this.socketIo.emit(flag, data);
    return { flag, data };
  }
}

module.exports = new SocketService();
