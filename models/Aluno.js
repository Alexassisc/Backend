const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Aluno = sequelize.define(
  'Aluno',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      },
    },
    idade: {
      type: DataTypes.INTEGER,
    },
    matricula: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Aluno;
