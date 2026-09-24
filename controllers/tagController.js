const db = require('../db');

// Crear un nuevo Tag
exports.createTag = async (req, res) => {
  const { name, category } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El nombre del tag es obligatorio' });
  }

  // Normalizar nombre (minúsculas, sin espacios extra)
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, '_');
  const tagCategory = category ? category.toLowerCase() : 'general';

  try {
    const newTag = await db.query(
      'INSERT INTO tags (name, category) VALUES ($1, $2) RETURNING *',
      [cleanName, tagCategory]
    );

    res.status(201).json({
      message: 'Tag creado exitosamente',
      tag: newTag.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') { // Violación de unicidad en Postgres
      return res.status(400).json({ error: 'El tag ya existe' });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al crear el tag' });
  }
};

// Listar o buscar Tags
exports.getTags = async (req, res) => {
  const { search, category } = req.query;

  try {
    let query = 'SELECT * FROM tags WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      query += ` AND name LIKE $${params.length}`;
    }

    if (category) {
      params.push(category.toLowerCase());
      query += ` AND category = $${params.length}`;
    }

    query += ' ORDER BY name ASC LIMIT 50';

    const tags = await db.query(query, params);
    res.json(tags.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los tags' });
  }
};