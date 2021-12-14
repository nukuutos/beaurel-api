const app = require('./app');

const { connectDB } = require('./utils/database');
const { connectRedis } = require('./utils/redis');

connectRedis();
connectDB();

app.listen(process.env.PORT);
