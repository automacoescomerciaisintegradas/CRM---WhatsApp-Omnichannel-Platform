const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUri = process.env.DATABASE_URL || 'postgresql://chatwoot:chatwoot_secret_pass_2026@127.0.0.1:5432/crm';

const sequelize = new Sequelize(dbUri, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
