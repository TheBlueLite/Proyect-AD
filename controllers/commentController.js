const db = require('../db');

// Agregar comentario a una publicación
exports.createComment = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'El contenido del comentario no puede estar vacío' });
  }

  try {
    // 1. Verificar si la publicación existe y qué capa requiere
    const postQuery = await db.query('SELECT min_layer FROM posts WHERE id = $1', [postId]);

    if (postQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    const postMinLayer = postQuery.rows[0].min_layer;

    // 2. Comprobar que el usuario tenga la capa mínima requerida para interactuar
    if (req.user.layer < postMinLayer) {
      return res.status(403).json({ 
        error: `Requiere estar en Capa ${postMinLayer} o superior para comentar en esta publicación.` 
      });
    }

    // 3. Insertar el comentario
    const newComment = await db.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [postId, req.user.id, content]
    );

    res.status(201).json({
      message: 'Comentario publicado exitosamente',
      comment: newComment.rows[0]
    });
  } catch (err) {
    console.error('[Comment Error]', err);
    res.status(500).json({ error: 'Error al publicar el comentario' });
  }
};

// Obtener comentarios de una publicación
exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await db.query(`
      SELECT c.*, u.username as author, u.layer as author_layer
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = $1
      ORDER BY c.created_at ASC
    `, [postId]);

    res.json(comments.rows);
  } catch (err) {
    console.error('[Comment Fetch Error]', err);
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};