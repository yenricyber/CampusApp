import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const DB_CONFIG = {
  host: process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: Number(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER || '4HekmGDCW3KY9k4.root',
  password: process.env.TIDB_PASSWORD || '8PTZiVJ6VF6FPtys',
  database: process.env.TIDB_DATABASE || 'campus_app',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool = mysql.createPool(DB_CONFIG);

/**
 * Initialize TiDB Cloud tables and default seed data
 */
export async function initDatabase() {
  try {
    console.log(`[TiDB Cloud] Connecting to ${DB_CONFIG.host}:${DB_CONFIG.port} (${DB_CONFIG.database})...`);

    // 1. Users table for authentication
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        matricula VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        career VARCHAR(255) DEFAULT 'Ingeniería en Sistemas Computacionales',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Students profile table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        matricula VARCHAR(50) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        career VARCHAR(255) NOT NULL,
        semester VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        gpa DECIMAL(4,2) DEFAULT 9.42,
        credits_earned INT DEFAULT 210,
        credits_total INT DEFAULT 340,
        attendance DECIMAL(4,1) DEFAULT 96.8,
        blood_type VARCHAR(10) DEFAULT 'O+',
        validity VARCHAR(50) DEFAULT 'DIC 2026',
        crypto_token VARCHAR(100) DEFAULT '9A2F • 71BC • E048',
        avatar_url LONGTEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Submissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        matricula VARCHAR(50) NOT NULL,
        activity_title VARCHAR(255) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size VARCHAR(50) NOT NULL,
        comments TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Update existing student and user to new domain .universidadlatino.edu.mx if present
    await pool.query(
      `UPDATE students SET email = 'sofia.martinez@universidadlatino.edu.mx' WHERE matricula = '319245678'`
    ).catch(() => {});
    await pool.query(
      `UPDATE users SET email = 'sofia.martinez@universidadlatino.edu.mx' WHERE matricula = '319245678'`
    ).catch(() => {});

    // Seed default student if not present
    const [existingStudents] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT id FROM students WHERE matricula = ?',
      ['319245678']
    );

    if (existingStudents.length === 0) {
      await pool.query(
        `INSERT INTO students (
          matricula, name, email, career, semester, status, gpa, credits_earned, credits_total,
          attendance, blood_type, validity, barcode, crypto_token, avatar_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          '319245678',
          'Sofía Martínez Reyes',
          'sofia.martinez@universidadlatino.edu.mx',
          'Ingeniería en Sistemas Computacionales',
          '6° Semestre',
          'Alumna Regular',
          9.42,
          210,
          340,
          96.8,
          'O+',
          'DIC 2026',
          'LIB-319245678-BC',
          '9A2F • 71BC • E048',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBkwdsC9GNO7dkV84YoPwLgYvcqrGnS_lU1VPjK98RCi0BlN7sEXxT4NAnQk0cYNO94ZC7gJUnuiFJHxVeAyokbZU5hPYXYYXbg3ju6jOwVpy7vFBkI6OAdR_9oqFZ4J-Zr9ilpsRXoJnqDE4_wETFnkagIuhyT374GhcG1RotYAK68nwtaYpi1ZsdfJNd4aP8626VDgDlfuWtaM9dcJu7OTesnrjTzUxLzQkqKZfXPzZHrsAdGNhP_',
        ]
      );
      console.log('[TiDB Cloud] Default student seeded successfully.');
    }

    // Seed default user for login if not present
    const [existingUsers] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ?',
      ['sofia.martinez@universidadlatino.edu.mx']
    );

    if (existingUsers.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await pool.query(
        `INSERT INTO users (full_name, matricula, email, password, career)
         VALUES (?, ?, ?, ?, ?)`,
        [
          'Sofía Martínez Reyes',
          '319245678',
          'sofia.martinez@universidadlatino.edu.mx',
          hashedPassword,
          'Ingeniería en Sistemas Computacionales',
        ]
      );
      console.log('[TiDB Cloud] Default demo user seeded successfully.');
    }

    console.log('[TiDB Cloud] Schema initialized and verified on TiDB Cloud cluster.');
    return true;
  } catch (error: any) {
    console.error('[TiDB Cloud] Initialization error:', error.message);
    throw error;
  }
}
