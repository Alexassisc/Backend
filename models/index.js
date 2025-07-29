const Aluno = require('./Aluno');
const Foto = require('./Foto');


Aluno.hasMany(Foto, { foreignKey: 'alunoId', as: 'fotos' });
Foto.belongsTo(Aluno, { foreignKey: 'alunoId', as: 'aluno' });

module.exports = { Aluno, Foto };
