const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Remove a specific warning or all warnings for a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt =>
      opt.setName('user').setDescription('The user whose warnings to clear').setRequired(true))
    .addIntegerOption(opt =>
      opt.setName('id').setDescription('Warning ID to remove (omit to clear all)')),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warnId = interaction.options.getInteger('id');

    if (warnId) {
      const result = await query(
        'DELETE FROM warnings WHERE id = ? AND guild_id = ? AND user_id = ?',
        [warnId, interaction.guild.id, target.id],
      );
      if (!result.affectedRows) {
        return interaction.reply({ content: `Warning #${warnId} not found for that user.`, ephemeral: true });
      }
      return interaction.reply(`✅ Removed warning #${warnId} from **${target.tag}**.`);
    }

    const result = await query(
      'DELETE FROM warnings WHERE guild_id = ? AND user_id = ?',
      [interaction.guild.id, target.id],
    );
    await interaction.reply(`✅ Cleared **${result.affectedRows}** warning(s) from **${target.tag}**.`);
  },
};
