const dotenv = require('dotenv');
const { Sequelize } = require ('sequelize');
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER, 
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: process.env.NODE_ENV === 'development' ? (...msg) => console.log(msg) : false,
    }
);



module.exports = sequelize;