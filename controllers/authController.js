const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// === REGISTRAR USUÁRIO (gera token) ===
exports.register = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || nome.length < 3 || nome.length > 255) {
    return res
      .status(400)
      .json({ message: 'O nome deve ter entre 3 e 255 caracteres.' });
  }

  if (!senha || senha.length < 6 || senha.length > 50) {
    return res
      .status(400)
      .json({ message: 'A senha deve ter entre 6 e 50 caracteres.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ message: 'O e-mail informado é inválido.' });
  }

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: 'E-mail já cadastrado' });

    const hashedPassword = await bcrypt.hash(senha, 8);
    const user = await User.create({ nome, email, senha: hashedPassword });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.status(201).json({ user: { id: user.id, nome, email }, token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no cadastro' });
  }
};

// === LOGIN ===
exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida)
      return res.status(400).json({ message: 'Senha incorreta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({ user: { id: user.id, nome: user.nome, email }, token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no login' });
  }
};

// === LISTAR TODOS OS USUÁRIOS ===
exports.listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nome', 'email', 'createdAt'],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar usuários' });
  }
};

// === OBTER USUÁRIO POR ID ===
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nome', 'email', 'createdAt'],
    });
    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// === ATUALIZAR USUÁRIO ===
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado' });

    const { nome, email, senha } = req.body;

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists)
        return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const dadosAtualizados = { nome, email };
    if (senha) dadosAtualizados.senha = await bcrypt.hash(senha, 8);

    await user.update(dadosAtualizados);
    res.json({ id: user.id, nome: user.nome, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// === DELETAR USUÁRIO ===
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado' });

    await user.destroy();
    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};
