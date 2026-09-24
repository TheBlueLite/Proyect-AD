const db = require('../db');

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await db.query(
      'SELECT id, username, email, layer, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

// Actualizar información básica del perfil
exports.updateProfile = async (req, res) => {
  const { username } = req.body;

  try {
    const updatedUser = await db.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, layer',
      [username, req.user.id]
    );

    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

// Cambiar la capa de un usuario (RESTRINGIDO A CAPA 5)
exports.updateUserLayer = async (req, res) => {
  const { id } = req.params;
  const { layer } = req.body;

  if (!layer || layer < 1 || layer > 5) {
    return res.status(400).json({ error: 'La capa debe ser un número entre 1 y 5' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET layer = $1 WHERE id = $2 RETURNING id, username, email, layer',
      [layer, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      message: `Capa del usuario cambiada exitosamente a Capa ${layer}`,
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cambiar la capa del usuario' });
  }
};

// Obtener publicaciones creadas por el usuario autenticado
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await db.query(`
      SELECT p.*, ARRAY_AGG(t.name) as tags
      FROM posts p
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    res.json({
      total: posts.rows.length,
      posts: posts.rows
    });
  } catch (err) {
    console.error('[Get My Posts Error]', err);
    res.status(500).json({ error: 'Error al obtener las publicaciones del usuario' });
  }
};