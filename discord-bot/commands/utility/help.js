const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const COMMANDS = {
  '🛡️ Moderation': [
    '`/ban <user> [reason]` — Ban a member',
    '`/kick <user> [reason]` — Kick a member',
    '`/timeout <user> <duration> [reason]` — Timeout a member',
    '`/purge <amount>` — Bulk delete messages (max 100)',
    '`/warn <user> <reason>` — Issue a warning',
    '`/warnings <user>` — View a user\'s warnings',
    '`/clearwarn <user> [id]` — Remove a warning or clear all',
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
    '`/remind <time> <message>` — Set a reminder (e.g. `30m`, `2h`, `1d`)',
    '`/setprefix <prefix>` — Change the message prefix (Manage Server)',
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
