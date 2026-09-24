-- Extensión para la tabla de usuarios si aún no tiene todos los campos
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    layer INT DEFAULT 1 CHECK (layer BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para Categorías/Tipos de Tags (copyright, character, artist, general)
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(30) DEFAULT 'general' CHECK (category IN ('copyright', 'character', 'artist', 'general')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de publicaciones / contenido
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    content_url TEXT NOT NULL,
    description TEXT,
    min_layer INT DEFAULT 1 CHECK (min_layer BETWEEN 1 AND 5),
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia N:M entre posts y tags
CREATE TABLE IF NOT EXISTS post_tags (
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Tabla para Comentarios en Publicaciones
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);