import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

export async function connectDB() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
    console.log('MySQL connected successfully');
  } finally {
    connection.release();
  }
}
