-- Run this manually if you prefer to create tables outside the bot.
-- The bot also auto-creates these on startup via initSchema().

CREATE TABLE IF NOT EXISTS guild_settings (
  guild_id   VARCHAR(20) PRIMARY KEY,
  prefix     VARCHAR(10) NOT NULL DEFAULT '!'
);

CREATE TABLE IF NOT EXISTS warnings (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  guild_id      VARCHAR(20) NOT NULL,
  user_id       VARCHAR(20) NOT NULL,
  moderator_id  VARCHAR(20) NOT NULL,
  reason        TEXT        NOT NULL,
  created_at    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_guild_user (guild_id, user_id)
);

CREATE TABLE IF NOT EXISTS reminders (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     VARCHAR(20) NOT NULL,
  channel_id  VARCHAR(20) NOT NULL,
  message     TEXT        NOT NULL,
  due_at      DATETIME    NOT NULL,
  created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_due (due_at)
);
