import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { pool, initDatabase } from './db.js';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'campusapp-super-secret-key';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize TiDB Cloud tables asynchronously
let isDbReady = false;
let dbInitError: string | null = null;

initDatabase()
  .then(() => {
    isDbReady = true;
    console.log('[TiDB Cloud] Database ready and accepting queries.');
  })
  .catch((err) => {
    dbInitError = err.message;
    console.error('[TiDB Cloud] Database connection failed:', err.message);
  });

/* ==========================================================================
   API ENDPOINTS FOR TIDB CLOUD
   ========================================================================== */

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado.' });
    req.user = user;
    next();
  });
};

// 1. Health & Database Diagnostic
app.get('/api/health', async (req, res) => {
  try {
    const startTime = Date.now();
    const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT VERSION() AS version');
    const latency = Date.now() - startTime;

    res.json({
      status: 'ok',
      database: 'connected',
      provider: 'TiDB Cloud Serverless',
      version: rows[0]?.version || '8.0',
      databaseName: process.env.TIDB_DATABASE || 'campus_app',
      latencyMs: latency,
      isDbReady,
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// 2. Auth: Register Student
app.post('/api/auth/register', async (req, res) => {
  const { full_name, matricula, email, password, career, semester, avatarBase64 } = req.body;

  if (!full_name || !matricula || !email || !password || !career || !semester) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // Institutional email validation rule (.universidadlatino.edu.mx)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*universidadlatino\.edu\.mx$/i;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Por favor, utiliza tu correo institucional válido.' });
  }

  try {
    // Check for existing user in TiDB Cloud
    const [existing] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT id FROM users WHERE email = ? OR matricula = ?',
      [email.trim().toLowerCase(), matricula.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con este correo o matrícula.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into TiDB Cloud
    const [result] = await pool.query<mysql.ResultSetHeader>(
      `INSERT INTO users (full_name, matricula, email, password, career)
       VALUES (?, ?, ?, ?, ?)`,
      [full_name.trim(), matricula.trim(), email.trim().toLowerCase(), hashedPassword, career]
    );

    // Also register in students profile table
    const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80';
    const finalAvatar = avatarBase64 || defaultAvatar;

    await pool.query(
      `INSERT INTO students (
        matricula, name, email, career, semester, status, gpa, credits_earned, credits_total,
        attendance, blood_type, validity, barcode, crypto_token, avatar_url
      ) VALUES (?, ?, ?, ?, ?, 'Alumno Regular',
        10.0, 0, 340, 100.0, 'O+', 'DIC 2026', CONCAT('LIB-', ?, '-BC'), '7C4A • 18FE • D902', ?)
      ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), career = VALUES(career), semester = VALUES(semester), avatar_url = VALUES(avatar_url)`,
      [matricula.trim(), full_name.trim(), email.trim().toLowerCase(), career, semester, matricula.trim(), finalAvatar]
    );

    const token = jwt.sign(
      { userId: result.insertId, matricula: matricula.trim() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente en TiDB Cloud.',
      userId: result.insertId,
      token,
      student: {
        name: full_name.trim(),
        matricula: matricula.trim(),
        email: email.trim().toLowerCase(),
      },
    });
  } catch (error: any) {
    console.error('Registration error on TiDB:', error);
    res.status(500).json({ error: 'Error al registrar en TiDB Cloud: ' + error.message });
  }
});

// 3. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña requeridos.' });
  }

  // Institutional email validation rule (.universidadlatino.edu.mx)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*universidadlatino\.edu\.mx$/i;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Por favor, utiliza tu correo institucional válido.' });
  }

  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      // If user doesn't exist, check students table or create demo account
      return res.status(401).json({ error: 'Credenciales inválidas o cuenta no registrada.' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, matricula: user.matricula },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Fetch corresponding student profile
    const [students] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM students WHERE matricula = ?',
      [user.matricula]
    );

    // Transform raw DB row into StudentProfile shape
    const rawStudent = students[0];
    const studentProfile = rawStudent ? {
      name: rawStudent.name,
      matricula: rawStudent.matricula,
      email: rawStudent.email,
      career: rawStudent.career,
      semester: rawStudent.semester,
      status: rawStudent.status,
      gpa: Number(rawStudent.gpa),
      credits: {
        earned: rawStudent.credits_earned,
        total: rawStudent.credits_total,
      },
      attendance: Number(rawStudent.attendance),
      bloodType: rawStudent.blood_type,
      validity: rawStudent.validity,
      barcode: rawStudent.barcode,
      cryptoToken: rawStudent.crypto_token,
      avatarUrl: rawStudent.avatar_url,
    } : null;

    res.json({
      success: true,
      message: 'Sesión iniciada correctamente.',
      token,
      user: {
        id: user.id,
        name: user.full_name,
        matricula: user.matricula,
        email: user.email,
      },
      studentProfile,
    });
  } catch (error: any) {
    console.error('Login error on TiDB:', error);
    res.status(500).json({ error: 'Error de autenticación con TiDB Cloud: ' + error.message });
  }
});

// 4. Get Current Student Profile
app.get('/api/student', authenticateToken, async (req: any, res: any) => {
  const matricula = req.user.matricula;
  try {
    const [rows] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM students WHERE matricula = ?',
      [matricula]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado en TiDB.' });
    }

    const s = rows[0];
    res.json({
      name: s.name,
      matricula: s.matricula,
      email: s.email,
      career: s.career,
      semester: s.semester,
      status: s.status,
      gpa: Number(s.gpa),
      credits: {
        earned: s.credits_earned,
        total: s.credits_total,
      },
      attendance: Number(s.attendance),
      bloodType: s.blood_type,
      validity: s.validity,
      barcode: s.barcode,
      cryptoToken: s.crypto_token,
      avatarUrl: s.avatar_url,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al consultar estudiante en TiDB: ' + error.message });
  }
});

// 5. Submit Activity to TiDB Cloud
app.post('/api/activities/submit', authenticateToken, async (req: any, res: any) => {
  const { activity_title, file_name, file_size, comments } = req.body;
  const matricula = req.user.matricula;

  if (!activity_title || !file_name) {
    return res.status(400).json({ error: 'Datos de entrega incompletos.' });
  }

  try {
    const [result] = await pool.query<mysql.ResultSetHeader>(
      `INSERT INTO submissions (matricula, activity_title, file_name, file_size, comments)
       VALUES (?, ?, ?, ?, ?)`,
      [matricula, activity_title, file_name, file_size || '1.2 MB', comments || '']
    );

    res.json({
      success: true,
      submissionId: result.insertId,
      message: 'Entrega guardada exitosamente en TiDB Cloud.',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al registrar entrega en TiDB: ' + error.message });
  }
});

// 6. Delete Account
app.delete('/api/auth/delete-account', authenticateToken, async (req: any, res: any) => {
  const { matricula } = req.body;
  const tokenMatricula = req.user.matricula;

  if (matricula !== tokenMatricula) {
    return res.status(403).json({ error: 'No autorizado para eliminar esta cuenta.' });
  }

  try {
    // Delete from users, students, and submissions tables
    await pool.query('DELETE FROM users WHERE matricula = ?', [matricula]);
    await pool.query('DELETE FROM students WHERE matricula = ?', [matricula]);
    await pool.query('DELETE FROM submissions WHERE matricula = ?', [matricula]);

    res.json({ success: true, message: 'Cuenta eliminada permanentemente.' });
  } catch (error: any) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Error al eliminar cuenta: ' + error.message });
  }
});

// 7. Import Calendar (.ics)
app.post('/api/calendar/import', authenticateToken, async (req: any, res: any) => {
  const { icsContent } = req.body;
  const matricula = req.user.matricula;

  if (!icsContent) {
    return res.status(400).json({ error: 'Contenido ICS requerido.' });
  }

  try {
    // Get student career and semester
    const [students] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT career, semester FROM students WHERE matricula = ?',
      [matricula]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    const { career, semester } = students[0];

    // Basic ICS parser
    const events = [];
    const lines = icsContent.split(/\\r?\\n/);
    let currentEvent: any = null;
    
    for (let line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('END:VEVENT') && currentEvent) {
        if (currentEvent.title) events.push(currentEvent);
        currentEvent = null;
      } else if (currentEvent) {
        if (line.startsWith('SUMMARY:')) currentEvent.title = line.substring(8).trim();
        if (line.startsWith('DESCRIPTION:')) currentEvent.description = line.substring(12).trim();
        if (line.startsWith('LOCATION:')) currentEvent.location = line.substring(9).trim();
        if (line.startsWith('DTSTART')) {
           const parts = line.split(':');
           if (parts.length > 1) {
             const rawDate = parts[1].trim();
             // basic extraction YYYYMMDD
             if (rawDate.length >= 8) {
               currentEvent.event_date = `${rawDate.substring(0,4)}-${rawDate.substring(4,6)}-${rawDate.substring(6,8)}`;
               if (rawDate.length > 8 && rawDate.includes('T')) {
                 const time = rawDate.split('T')[1];
                 if (time.length >= 4) {
                   currentEvent.due_time = `${time.substring(0,2)}:${time.substring(2,4)}`;
                 }
               }
             }
           }
        }
      }
    }

    if (events.length === 0) {
      return res.status(400).json({ error: 'No se encontraron eventos válidos en el archivo ICS.' });
    }

    // Insert events, ignoring exact duplicates
    let insertedCount = 0;
    for (const ev of events) {
      try {
        await pool.query(
          `INSERT IGNORE INTO calendar_events (career, semester, title, subject, description, location, due_time, event_date, type, badge_type)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            career,
            semester,
            ev.title,
            ev.title, // use title as subject for now
            ev.description || '',
            ev.location || 'Aula Asignada',
            ev.due_time || '00:00',
            ev.event_date || '2026-10-01',
            ev.title.toLowerCase().includes('examen') ? 'examen' : 'entregable',
            'normal'
          ]
        );
        insertedCount++;
      } catch (e) {
        // ignore individual insert errors (e.g. duplicate key)
      }
    }

    res.json({
      success: true,
      message: `Se procesaron ${events.length} eventos. Importación exitosa para la carrera y grado seleccionados.`,
      eventsFound: events.length
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al importar calendario: ' + error.message });
  }
});

// 8. Get Calendar Events
app.get('/api/calendar/events', authenticateToken, async (req: any, res: any) => {
  const matricula = req.user.matricula;
  try {
    const [students] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT career, semester FROM students WHERE matricula = ?',
      [matricula]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    const { career, semester } = students[0];

    const [events] = await pool.query<mysql.RowDataPacket[]>(
      'SELECT * FROM calendar_events WHERE career = ? AND semester = ? ORDER BY event_date ASC',
      [career, semester]
    );

    // Map to frontend EvaluationItem shape
    const mapped = events.map(e => ({
      id: e.id.toString(),
      badge: e.type === 'examen' ? 'Examen' : 'Entrega',
      badgeType: e.badge_type || 'normal',
      type: e.type,
      dueTime: e.due_time,
      title: e.title,
      subject: e.subject,
      description: e.description,
      location: e.location,
      actionText: e.type === 'examen' ? 'Ver Detalles' : 'Entregar',
      actionIcon: e.type === 'examen' ? 'visibility' : 'upload_file'
    }));

    res.json({ success: true, events: mapped });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener calendario: ' + error.message });
  }
});

/* ==========================================================================
   VITE MIDDLEWARE (DEV) & STATIC SERVING (PROD)
   ========================================================================== */

async function startServer() {
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not running in Vercel
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[CampusApp] Server running on http://0.0.0.0:${PORT}`);
    });
  }
}

startServer();

export default app;
