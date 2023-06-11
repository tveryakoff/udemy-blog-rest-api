const {Server} = require("socket.io");
let io;

module.exports = {
  getIo: () => io,
  init: httpsServer => {
    io = new Server(httpsServer,{cors: {
        origin: ["http://localhost:8080", 'http://localhost:3000'],
        methods: ["GET", "POST"]
      }})
    return io
  }
}
