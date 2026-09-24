const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Capa 1: Acceso General
router.get('/level-1', authMiddleware(1), (req, res) => {
  res.json({
    access: true,
    layer: 1,
    message: 'Bienvenido al contenido de Capa 1 (Público/General).'
  });
});

// Capa 2: Usuarios Registrados / Verificados
router.get('/level-2', authMiddleware(2), (req, res) => {
  res.json({
    access: true,
    layer: 2,
    message: 'Acceso concedido a Capa 2 (Verificado).'
  });
});

// Capa 5: Nivel de Administración Crítica
router.get('/level-5', authMiddleware(5), (req, res) => {
  res.json({
    access: true,
    layer: 5,
    message: 'Acceso concedido a Capa 5 (Soberanía / Core Admin).'
  });
});

module.exports = router;