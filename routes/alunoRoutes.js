const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, alunoController.listarAlunos);
router.get('/:id', authMiddleware, alunoController.buscarAluno);
router.post('/', authMiddleware, alunoController.criarAluno);
router.put('/:id', authMiddleware, alunoController.atualizarAluno);
router.delete('/:id', authMiddleware, alunoController.deletarAluno);

module.exports = router;
