const dotenv = require('dotenv');

module.exports = () => dotenv.config({ path: './config/envs/.env.test' });
