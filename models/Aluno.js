const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

const Aluno = sequelize.define(
  'Aluno',
  {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [3, 255],
          msg: 'Nome deve ter entre 3 e 255 caracteres',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'E-mail inválido',
        },
      },
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      },
    },
    idade: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [0],
          msg: 'Idade deve ser um número positivo',
        },
      },
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

Aluno.beforeCreate(async (aluno) => {
  let matriculaGerada = '';
  let existe = true;

  while (existe) {
    matriculaGerada = String(Math.floor(100000 + Math.random() * 900000));
    const alunoExistente = await Aluno.findOne({
      where: { matricula: matriculaGerada },
    });
    existe = !!alunoExistente;
  }

  aluno.matricula = matriculaGerada;
});

module.exports = Aluno;
