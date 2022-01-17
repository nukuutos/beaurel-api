const app = require('./app');

const { connectDB } = require('./utils/database');
const { connectRedis } = require('./utils/redis');
const { initIO } = require('./utils/socket');

connectRedis();
connectDB();

const server = app.listen(process.env.PORT);

initIO(server);
