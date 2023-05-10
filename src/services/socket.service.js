class SocketService {
  async init(io) {
    io.on("connection", async (socket) => {
      console.log("Client connected= socket.id", socket.id);
      socket.emit("zkoinit", "Socket server init..");
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
