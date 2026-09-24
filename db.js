const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env'), override: true });
const fs = require('fs');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('[PostgreSQL] Conexión establecida con éxito');
});

// Auto-ejecución del esquema SQL al iniciar el módulo
const initDb = async () => {
  try {
    const sqlPath = path.resolve(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await pool.query(sql);
    console.log('[PostgreSQL] Tablas verificadas e inicializadas desde schema.sql');
  } catch (err) {
    console.error('[PostgreSQL Error] Fallo al sincronizar el esquema SQL:', err.message);
  }
};

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
};