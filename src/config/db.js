// Pool de conexiones MySQL: reutiliza conexiones entre requests (eficiente) y
// expone helpers de consulta con promesas.
const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Sintaxis de marcadores ? con arrays
});

/** Ejecuta una consulta parametrizada (protege contra SQL Injection). */
async function query(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/** Verifica la conexión con MySQL al arrancar. */
async function ping() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
}

module.exports = { pool, query, ping };
