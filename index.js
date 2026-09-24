const express = require('express');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const layerRoutes = require('./routes/layerRoutes');
const userRoutes = require('./routes/userRoutes');
const tagRoutes = require('./routes/tagRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Sanitización contra inyección XSS
app.use((req, res, next) => {
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {}
        });
      }
    }
  }
  next(); // Continuar el flujo de la petición
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/layers', layerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Ruta base de estado
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    platform: 'AD (AfterDark)',
    layer_system: '5-Layer Authorization Active'
  });
});

// Ruta de prueba con diagnóstico de error detallado
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      timestamp: result.rows[0].now
    });
  } catch (err) {
    console.error('--- ERROR POSTGRES ---', err);
    res.status(500).json({
      success: false,
      error_message: err.message,
      error_code: err.code,
      detail: err.detail || 'Sin detalle adicional'
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[AD Server] Corriendo en el puerto ${PORT}`);
});