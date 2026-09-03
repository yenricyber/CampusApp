import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        studentId VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        name VARCHAR(255),
        program VARCHAR(255),
        semester VARCHAR(255),
        avatarUrl LONGTEXT
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        code VARCHAR(50),
        courseName VARCHAR(255),
        moduleOrDetail VARCHAR(255),
        title VARCHAR(255),
        description TEXT,
        dueTimeText VARCHAR(255),
        dueDate VARCHAR(50),
        dueTime VARCHAR(50),
        status VARCHAR(50),
        priority VARCHAR(50),
        progressPercent INT,
        timelineSection VARCHAR(50),
        category VARCHAR(50),
        data JSON
      )
    `);
    console.log('Tables are ready');
  } catch (error) {
    console.error('Failed to init DB:', error);
  }
};

initDB();

// --- Users Endpoints ---
app.post('/api/register', async (req, res) => {
  try {
    const { studentId, password, name, program, semester, avatarUrl } = req.body;
    const id = Date.now().toString();
    await pool.query(
      `INSERT INTO users (id, studentId, password, name, program, semester, avatarUrl) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, studentId, password, name, program, semester, avatarUrl || '']
    );
    res.json({ success: true, user: { id, studentId, name, program, semester, avatarUrl } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;
    const [rows]: any = await pool.query('SELECT * FROM users WHERE studentId = ? AND password = ?', [studentId, password]);
    if (rows.length > 0) {
      const user = rows[0];
      delete user.password;
      res.json({ success: true, user });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:studentId', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE studentId = ?', [req.params.studentId]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Tasks Endpoints ---
app.get('/api/tasks', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM tasks ORDER BY dueDate ASC, dueTime ASC');
    const tasks = rows.map((row: any) => ({
      ...row,
      ...row.data,
    }));
    tasks.forEach((t: any) => delete t.data);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = req.body;
    const data = JSON.stringify(task);
    await pool.query(
      `INSERT INTO tasks (id, code, courseName, moduleOrDetail, title, description, dueTimeText, dueDate, dueTime, status, priority, progressPercent, timelineSection, category, data) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [task.id, task.code || '', task.courseName || '', task.moduleOrDetail || '', task.title, task.description || '', task.dueTimeText || '', task.dueDate || '', task.dueTime || '', task.status, task.priority, task.progressPercent || 0, task.timelineSection || '', task.category || '', data]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const task = req.body;
    const data = JSON.stringify(task);
    await pool.query(
      `UPDATE tasks SET 
        code=?, courseName=?, moduleOrDetail=?, title=?, description=?, dueTimeText=?, dueDate=?, dueTime=?, status=?, priority=?, progressPercent=?, timelineSection=?, category=?, data=?
       WHERE id=?`,
      [task.code || '', task.courseName || '', task.moduleOrDetail || '', task.title, task.description || '', task.dueTimeText || '', task.dueDate || '', task.dueTime || '', task.status, task.priority, task.progressPercent || 0, task.timelineSection || '', task.category || '', data, req.params.id]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
export default app;
