const Sequelize = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    port: config.development.port
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Board = require('./board')(sequelize, Sequelize);
db.Cols = require('./column')(sequelize, Sequelize);
db.Tasks = require('./task')(sequelize, Sequelize);
db.ProfileUsers = require('./profile')(sequelize, Sequelize);
db.ChecklistItem = require('./checklistitem')(sequelize, Sequelize);
db.TaskChecklist = require('./taskchecklist')(sequelize, Sequelize);
// Thiết lập các mối quan hệ
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;