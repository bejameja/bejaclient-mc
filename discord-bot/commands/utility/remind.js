const { SlashCommandBuilder } = require('discord.js');
const { query } = require('../../database');

const DURATIONS = {
  m: 60,
  h: 3600,
  d: 86400,
  w: 604800,
};

function parseDuration(str) {
  const match = str.match(/^(\d+)([mhdw])$/i);
  if (!match) return null;
  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  return amount * DURATIONS[unit] * 1000;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remind')
    .setDescription('Set a reminder')
    .addStringOption(opt =>
      opt.setName('time')
        .setDescription('When to remind you, e.g. 10m, 2h, 1d, 1w')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('What to remind you about')
        .setRequired(true)),

  async execute(interaction) {
    const timeStr = interaction.options.getString('time');
    const message = interaction.options.getString('message');

    const ms = parseDuration(timeStr);
    if (!ms) {
      return interaction.reply({
        content: 'Invalid time format. Use a number followed by `m`, `h`, `d`, or `w` (e.g. `30m`, `2h`, `1d`).',
        ephemeral: true,
      });
    }

    const MAX_MS = 28 * 24 * 3600 * 1000; // 4 weeks
    if (ms > MAX_MS) {
      return interaction.reply({ content: 'Reminders can be at most 4 weeks in the future.', ephemeral: true });
    }

    const dueAt = new Date(Date.now() + ms);

    await query(
      'INSERT INTO reminders (user_id, channel_id, message, due_at) VALUES (?, ?, ?, ?)',
      [interaction.user.id, interaction.channel.id, message, dueAt],
    );

    const ts = Math.floor(dueAt.getTime() / 1000);
    await interaction.reply({ content: `⏰ Got it! I'll remind you <t:${ts}:R>: **${message}**`, ephemeral: true });
  },
};
