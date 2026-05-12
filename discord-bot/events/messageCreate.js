const PREFIX = '!';

const responses = {
  hello: 'Hey there! 👋',
  hi: 'Hello! 👋',
  ping: '🏓 Pong!',
  help: 'Use slash commands (/) for all features. Try `/help` for a list!',
};

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Respond to plain keywords without a prefix
    const lower = message.content.toLowerCase().trim();
    if (responses[lower]) {
      return message.reply(responses[lower]);
    }

    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'ping') {
      message.reply(`🏓 Pong! Latency: ${message.client.ws.ping}ms`);
    } else if (cmd === 'echo') {
      if (!args.length) return message.reply('Provide some text to echo.');
      message.reply(args.join(' '));
    }
  },
};
