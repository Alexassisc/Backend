const express = require('express');
const router = express.Router();
const fotoController = require('../controllers/fotoController');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // pasta onde as fotos vão ser salvas
  },
  filename: (req, file, cb) => {
    // Gerar nome único para evitar sobrescrita
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas'));
  }
};

const upload = multer({ storage, fileFilter });

router.get('/', authMiddleware, fotoController.listarFotos);
router.post('/', authMiddleware, upload.array('fotos', 10), fotoController.criarFoto); 
router.delete('/:id', authMiddleware, fotoController.deletarFoto);

module.exports = router;
