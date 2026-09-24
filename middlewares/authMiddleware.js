const jwt = require('jsonwebtoken');

module.exports = (requiredLayer = 1) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Verificación del Sistema de 5 Capas
      if (req.user.layer < requiredLayer) {
        return res.status(403).json({ 
          error: `Acceso restringido. Requiere autorización de Capa ${requiredLayer}` 
        });
      }

      next();
    } catch (err) {
      res.status(403).json({ error: 'Token inválido o expirado' });
    }
  };
};