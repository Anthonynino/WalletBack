import { DataTypes } from 'sequelize';
import sequelize from '../db/conection.js';

const Account = sequelize.define('Account', {
  owner: {
    type: DataTypes.STRING,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 }
  },
  pin: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, { timestamps: false });

export default Account;