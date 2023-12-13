require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql', // Puedes cambiar a 'postgres', 'sqlite', 'mssql', según la base de datos que estés utilizando
  }
);

module.exports = sequelize;
