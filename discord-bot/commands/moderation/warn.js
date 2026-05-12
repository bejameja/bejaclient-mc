const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Issue a warning to a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('The user to warn').setRequired(true))
    .addStringOption(opt =>
      opt.setName('reason').setDescription('Reason for the warning').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason');

    if (!target) return interaction.reply({ content: 'User not found in this server.', ephemeral: true });
    if (target.user.bot) return interaction.reply({ content: 'You cannot warn a bot.', ephemeral: true });

    await query(
      'INSERT INTO warnings (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)',
      [interaction.guild.id, target.id, interaction.user.id, reason],
    );

    const rows = await query(
      'SELECT COUNT(*) AS total FROM warnings WHERE guild_id = ? AND user_id = ?',
      [interaction.guild.id, target.id],
    );
    const total = rows[0].total;

    try {
      await target.send(`⚠️ You have been warned in **${interaction.guild.name}**.\nReason: ${reason}\nTotal warnings: ${total}`);
    } catch {
      // DMs disabled — continue without notifying
    }

    await interaction.reply(`⚠️ Warned **${target.user.tag}** (warning #${total}) — ${reason}`);
  },
};
