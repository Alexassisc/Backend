const { Aluno, Foto } = require('../models');

exports.listarAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.findAll({
      include: [{ model: Foto, as: 'fotos' }],
    });

    const BASE_URL = `${req.protocol}://${req.get('host')}`;

    const alunosComUrlCompleta = alunos.map((aluno) => {
      const alunoJSON = aluno.toJSON();

      alunoJSON.fotos = alunoJSON.fotos.map((foto) => ({
        ...foto,
        url: `${BASE_URL}${foto.url}`,
      }));

      return alunoJSON;
    });

    res.json(alunosComUrlCompleta);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar alunos' });
  }
};

exports.buscarAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id, {
      include: [{ model: Foto, as: 'fotos' }],
    });
    if (!aluno)
      return res.status(404).json({ message: 'Aluno não encontrado' });

    const BASE_URL = `${req.protocol}://${req.get('host')}`;
    const alunoJSON = aluno.toJSON();

    alunoJSON.fotos = alunoJSON.fotos.map((foto) => ({
      ...foto,
      url: `${BASE_URL}${foto.url}`,
    }));

    res.json(alunoJSON);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar aluno' });
  }
};

exports.criarAluno = async (req, res) => {
  try {
    const aluno = await Aluno.create(req.body);
    res.status(201).json(aluno);
  } catch (error) {
    console.error('Erro ao criar aluno:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      // Array para armazenar as mensagens de erro
      const details = error.errors.map((e) => {
        if (e.path === 'email') return 'email must be unique';
        if (e.path === 'matricula') return 'matricula must be unique';
        return e.message; // mensagem genérica para outros casos
      });

      return res.status(400).json({
        message: 'Erro ao criar aluno',
        error: 'Validation error',
        details,
      });
    }

    return res.status(400).json({ message: 'Erro ao criar aluno' });
  }
};

exports.atualizarAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno)
      return res.status(404).json({ message: 'Aluno não encontrado' });

    await aluno.update(req.body);
    res.json(aluno);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar aluno' });
  }
};

exports.deletarAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByPk(req.params.id);
    if (!aluno)
      return res.status(404).json({ message: 'Aluno não encontrado' });

    await aluno.destroy();
    res.json({ message: 'Aluno deletado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar aluno' });
  }
};
