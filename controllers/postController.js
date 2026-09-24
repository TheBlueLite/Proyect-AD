const db = require('../db');

// Crear una publicación asignando capas y etiquetas
exports.createPost = async (req, res) => {
  const { title, content_url, description, min_layer, tags } = req.body;

  if (!title || !content_url) {
    return res.status(400).json({ error: 'El título y la URL del contenido son obligatorios' });
  }

  const postLayer = min_layer ? Number(min_layer) : 1;

  // No permitir que un usuario publique contenido con una capa superior a la suya
  if (postLayer > req.user.layer) {
    return res.status(403).json({ 
      error: `No tienes permisos para crear contenido de Capa ${postLayer}. Tu capa actual es ${req.user.layer}.` 
    });
  }

  try {
    // Insertar post
    const newPost = await db.query(
      'INSERT INTO posts (title, content_url, description, min_layer, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content_url, description, postLayer, req.user.id]
    );

    const postId = newPost.rows[0].id;

    // Relacionar tags si se enviaron
    if (Array.isArray(tags) && tags.length > 0) {
      for (let tagId of tags) {
        await db.query(
          'INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [postId, tagId]
        );
      }
    }

    res.status(201).json({
      message: 'Publicación creada exitosamente',
      post: newPost.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la publicación' });
  }
};

// Obtener publicaciones filtradas, paginadas y con búsqueda por texto
// Obtener publicaciones filtradas, paginadas y con búsqueda por texto
exports.getPosts = async (req, res) => {
  const userLayer = req.user ? req.user.layer : 1;
  const { tag, search, page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, parseInt(limit) || 10);
  const offset = (pageNum - 1) * limitNum;

  try {
    let query = `
      SELECT p.*, u.username as author, ARRAY_AGG(t.name) as tags
      FROM posts p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN post_tags pt ON p.id = pt.post_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.min_layer <= $1
    `;
    const params = [userLayer];

    // Filtrar por tag
    if (tag) {
      params.push(tag.toLowerCase());
      query += ` AND t.name = $${params.length}`;
    }

    // Filtrar por texto en título o descripción
    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      const searchParamIdx = params.length;
      query += ` AND (LOWER(p.title) LIKE $${searchParamIdx} OR LOWER(p.description) LIKE $${searchParamIdx})`;
    }

    query += ' GROUP BY p.id, u.username ORDER BY p.created_at DESC';

    // Paginación limpia
    params.push(limitNum);
    query += ` LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const posts = await db.query(query, params);

    res.json({
      page: pageNum,
      limit: limitNum,
      count: posts.rows.length,
      data: posts.rows
    });
  } catch (err) {
    console.error('[Posts Error]', err);
    res.status(500).json({ error: 'Error al obtener publicaciones' });
  }
};

// Subir archivo multimedia directo
exports.uploadMedia = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se ha adjuntado ningún archivo' });
  }

  // Generar URL pública estática del archivo
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(201).json({
    message: 'Archivo subido exitosamente',
    url: fileUrl
  });
};