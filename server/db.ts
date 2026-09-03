import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const poolConfig: mysql.PoolOptions = process.env.TIDB_DATABASE_URL ? { uri: process.env.TIDB_DATABASE_URL } : {
  host: process.env.TIDB_HOST || 'gateway01.us-east-1.prod.aws.tidbcloud.com',
  port: Number(process.env.TIDB_PORT) || 4000,
  user: process.env.TIDB_USER || '3zZJMgtCbx897i8.root',
  password: process.env.TIDB_PASSWORD || 'yjnd7le5Eb7x8xme',
  database: process.env.TIDB_DATABASE || 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
  }
};

const pool = mysql.createPool(poolConfig);

export default pool;
