const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Ver publicaciones permitidas según la capa del token
router.get('/', authMiddleware(1), postController.getPosts);

// Crear publicación (requiere autenticación)
router.post('/', authMiddleware(1), postController.createPost);

router.post('/upload', authMiddleware(1), upload.single('media'), postController.uploadMedia);

module.exports = router;