const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Ver comentarios de un post (Capa 1+)
router.get('/post/:postId', authMiddleware(1), commentController.getCommentsByPost);

// Agregar comentario a un post (Capa 1+)
router.post('/post/:postId', authMiddleware(1), commentController.createComment);

module.exports = router;