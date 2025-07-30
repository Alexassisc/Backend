const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token expirado - envia status 401 e mensagem específica
      return res.status(401).json({ message: 'Token expirado' });
    }

    // Outros erros de token inválido
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = authMiddleware;
