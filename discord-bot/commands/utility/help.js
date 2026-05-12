const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const COMMANDS = {
  '🛡️ Moderation': [
    '`/ban <user> [reason]` — Ban a member',
    '`/kick <user> [reason]` — Kick a member',
    '`/timeout <user> <duration> [reason]` — Timeout a member',
    '`/purge <amount>` — Bulk delete messages',
  ],
  '🎉 Fun': [
    '`/roll [sides] [count]` — Roll dice',
    '`/joke` — Get a random joke',
    '`/poll <question> <opt1> <opt2> [opt3] [opt4]` — Create a poll',
    '`/coinflip` — Flip a coin',
  ],
  '🔧 Utility': [
    '`/ping` — Check bot latency',
    '`/serverinfo` — Show server info',
    '`/userinfo [user]` — Show user info',
    '`/help` — Show this menu',
  ],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available commands'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📖 Command List')
      .setColor(0x5865F2)
      .setTimestamp();

    for (const [category, cmds] of Object.entries(COMMANDS)) {
      embed.addFields({ name: category, value: cmds.join('\n') });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
