// Punto de entrada: verifica dependencias externas (MySQL) y arranca el servidor.
const app = require('./app');
const env = require('./config/env');
const db = require('./config/db');

async function main() {
  try {
    await db.ping();
    console.log('✔ Conexión a MySQL verificada');
  } catch (err) {
    console.error('✖ No se pudo conectar a MySQL:', err.code || err.message);
    console.error('  Revisa XAMPP, credenciales y la base de datos en el archivo .env');
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    console.log(`✔ Servidor corriendo en http://localhost:${env.port} (${env.nodeEnv})`);
  });

  // Cierre ordenado
  const shutdown = (signal) => {
    console.log(`\n${signal} recibido: cerrando servidor...`);
    server.close(() => process.exit(0));
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main();
