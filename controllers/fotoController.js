const Foto = require('../models/Foto');

exports.listarFotos = async (req, res) => {
  try {
    const fotos = await Foto.findAll();
    res.json(fotos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar fotos' });
  }
};

exports.criarFoto = async (req, res) => {
  try {
    const BASE_URL = `${req.protocol}://${req.get('host')}`;
    const { alunoId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Nenhuma imagem enviada' });
    }

    const fotosParaCriar = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      alunoId,
    }));

    const fotosCriadas = await Foto.bulkCreate(fotosParaCriar);

    const fotosComUrlCompleta = fotosCriadas.map(foto => {
      const fotoJson = foto.toJSON();
      fotoJson.url = `${BASE_URL}${fotoJson.url}`;
      return fotoJson;
    });

    res.status(201).json(fotosComUrlCompleta);
  } catch (error) {
    console.error('Erro ao criar fotos:', error);
    res.status(500).json({ message: 'Erro ao criar fotos' });
  }
};

exports.deletarFoto = async (req, res) => {
  try {
    const foto = await Foto.findByPk(req.params.id);
    if (!foto) return res.status(404).json({ message: 'Foto não encontrada' });

    await foto.destroy();
    res.json({ message: 'Foto deletada' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar foto' });
  }
};
