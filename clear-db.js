import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_CONFIG = {
  host: process.env.TIDB_HOST,
  port: Number(process.env.TIDB_PORT),
  user: process.env.TIDB_USER,
  password: process.env.TIDB_PASSWORD,
  database: process.env.TIDB_DATABASE,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  }
};

async function clearDB() {
  const connection = await mysql.createConnection(DB_CONFIG);
  try {
    console.log('🗑️  Vaciando todas las tablas de la base de datos...');
    
    // Disable FK checks to allow truncation in any order
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await connection.query('TRUNCATE TABLE submissions');
    console.log('  ✅ submissions — vaciada');
    
    await connection.query('TRUNCATE TABLE students');
    console.log('  ✅ students — vaciada');
    
    await connection.query('TRUNCATE TABLE users');
    console.log('  ✅ users — vaciada');
    
    // Re-enable FK checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('\n🎉 Base de datos completamente vacía. Lista para producción.');
  } catch (err) {
    console.error('❌ Error al vaciar la base de datos:', err);
  } finally {
    await connection.end();
  }
}

clearDB();
