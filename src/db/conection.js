import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Cargar variables de entorno explícitamente
dotenv.config(); 

console.log('Cargando DB:', process.env.DB_NAME); // Debería imprimir 'wallet_db'
console.log('Usuario:', process.env.DB_USER);     // Debería imprimir tu usuario

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false,
    define: {
      engine: 'InnoDB'
    }
  }
);

export default sequelize;