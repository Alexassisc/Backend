const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Foto = sequelize.define('Foto', {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alunoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = Foto;
