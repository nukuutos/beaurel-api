const socketIO = require('socket.io');
const HttpError = require('../models/utils/http-error');

let io;

module.exports = {
  initIO: (httpServer) => {
    io = socketIO(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) throw new HttpError('No socket io connection!');
    return io;
  },
};
