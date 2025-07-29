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
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        unique: true,
        fields: ['matricula'],
      },
    ],
  }
);

module.exports = Aluno;