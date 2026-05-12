const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z',
});

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function initSchema() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS guild_settings (
      guild_id   VARCHAR(20) PRIMARY KEY,
      prefix     VARCHAR(10) NOT NULL DEFAULT '!'
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS warnings (
      id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      guild_id      VARCHAR(20) NOT NULL,
      user_id       VARCHAR(20) NOT NULL,
      moderator_id  VARCHAR(20) NOT NULL,
      reason        TEXT        NOT NULL,
      created_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_guild_user (guild_id, user_id)
    )
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS reminders (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id     VARCHAR(20) NOT NULL,
      channel_id  VARCHAR(20) NOT NULL,
      message     TEXT        NOT NULL,
      due_at      DATETIME    NOT NULL,
      created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_due (due_at)
    )
  `);
}

module.exports = { pool, query, initSchema };
