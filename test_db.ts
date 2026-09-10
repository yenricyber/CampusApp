import { pool } from './server/db.js';

async function test() {
  try {
    const [rows] = await pool.query("SHOW TABLES LIKE 'calendar_events'");
    console.log("Tables matching calendar_events:", rows);
    
    // Create it just in case
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        career VARCHAR(255) NOT NULL,
        semester VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        description TEXT,
        location VARCHAR(255),
        due_time VARCHAR(50),
        event_date VARCHAR(50),
        type VARCHAR(50),
        badge_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_event (career, semester, title, event_date)
      )
    `);
    console.log("Table ensured.");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
test();
