const dotenv = require('dotenv');

dotenv.config({ path: './config/envs/.env.dev' });

const app = require('./app');

const { connectDB } = require('./utils/database');
const { connectReddis } = require('./utils/redis');

connectReddis();
connectDB();

app.listen(process.env.PORT);
