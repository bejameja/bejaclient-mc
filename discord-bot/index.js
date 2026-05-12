require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { initSchema, query } = require('./database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
// guild_id -> prefix cache, populated on demand
client.prefixCache = new Map();

// Load slash commands
const commandFolders = fs.readdirSync(path.join(__dirname, 'commands'));
for (const folder of commandFolders) {
  const files = fs.readdirSync(path.join(__dirname, 'commands', folder)).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    }
  }
}

// Load events
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Poll for due reminders every 30 seconds
function startReminderPoller() {
  setInterval(async () => {
    try {
      const due = await query(
        'SELECT * FROM reminders WHERE due_at <= NOW() ORDER BY due_at LIMIT 50',
      );
      if (!due.length) return;

      const ids = due.map(r => r.id);
      await query(`DELETE FROM reminders WHERE id IN (${ids.map(() => '?').join(',')})`, ids);

      for (const reminder of due) {
        try {
          const channel = await client.channels.fetch(reminder.channel_id);
          if (channel?.isTextBased()) {
            await channel.send(`<@${reminder.user_id}> ⏰ Reminder: ${reminder.message}`);
          }
        } catch {
          // channel may have been deleted — skip silently
        }
      }
    } catch (err) {
      console.error('Reminder poller error:', err);
    }
  }, 30_000);
}

// Graceful shutdown for Pterodactyl SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down...');
  client.destroy();
  process.exit(0);
});

(async () => {
  try {
    await initSchema();
    console.log('Database schema ready.');
  } catch (err) {
    console.error('Failed to initialise database:', err);
    process.exit(1);
  }

  client.once('ready', () => startReminderPoller());
  await client.login(process.env.DISCORD_TOKEN);
})();
