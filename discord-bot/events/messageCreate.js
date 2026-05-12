const { query } = require('../database');

const DEFAULT_PREFIX = '!';

const keywords = {
  hello: 'Hey there! 👋',
  hi: 'Hello! 👋',
  ping: '🏓 Pong!',
  help: 'Use slash commands (/) for all features. Try `/help` for a list!',
};

async function getPrefix(client, guildId) {
  if (!guildId) return DEFAULT_PREFIX;
  if (client.prefixCache.has(guildId)) return client.prefixCache.get(guildId);

  const rows = await query('SELECT prefix FROM guild_settings WHERE guild_id = ?', [guildId]);
  const prefix = rows[0]?.prefix ?? DEFAULT_PREFIX;
  client.prefixCache.set(guildId, prefix);
  return prefix;
}

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const lower = message.content.toLowerCase().trim();
    if (keywords[lower]) return message.reply(keywords[lower]);

    const prefix = await getPrefix(client, message.guild?.id);
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'ping') {
      message.reply(`🏓 Pong! Latency: ${message.client.ws.ping}ms`);
    } else if (cmd === 'echo') {
      if (!args.length) return message.reply('Provide some text to echo.');
      message.reply(args.join(' '));
    }
  },
};
