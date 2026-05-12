const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('The user to check').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');

    const rows = await query(
      'SELECT id, moderator_id, reason, created_at FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 10',
      [interaction.guild.id, target.id],
    );

    if (!rows.length) {
      return interaction.reply({ content: `**${target.tag}** has no warnings.`, ephemeral: true });
    }

    const lines = rows.map((w, i) =>
      `**#${i + 1}** (ID: ${w.id}) — <@${w.moderator_id}> — ${w.reason}\n<t:${Math.floor(new Date(w.created_at).getTime() / 1000)}:R>`,
    );

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Warnings for ${target.tag}`)
      .setDescription(lines.join('\n\n'))
      .setColor(0xFEE75C)
      .setFooter({ text: `Showing up to 10 most recent` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
