const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const DURATIONS = {
  '60s': 60_000,
  '5m': 5 * 60_000,
  '10m': 10 * 60_000,
  '1h': 60 * 60_000,
  '1d': 24 * 60 * 60_000,
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout (mute) a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('The user to timeout').setRequired(true))
    .addStringOption(opt =>
      opt.setName('duration')
        .setDescription('Duration of the timeout')
        .setRequired(true)
        .addChoices(
          { name: '60 seconds', value: '60s' },
          { name: '5 minutes', value: '5m' },
          { name: '10 minutes', value: '10m' },
          { name: '1 hour', value: '1h' },
          { name: '1 day', value: '1d' },
        ))
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the timeout')),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const durationKey = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') ?? 'No reason provided';
    const ms = DURATIONS[durationKey];

    if (!target) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });

    await target.timeout(ms, reason);
    await interaction.reply(`✅ **${target.user.tag}** timed out for ${durationKey} — ${reason}`);
  },
};
