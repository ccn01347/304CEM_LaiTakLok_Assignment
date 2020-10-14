const monk = require('monk');
const connectionString = process.env.MONGODB_URL || 'localhost:27017/304CEM_LTL';
const db = monk(connectionString);

module.exports = db;