const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setprefix')
    .setDescription('Change the bot\'s message prefix for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption(opt =>
      opt.setName('prefix')
        .setDescription('New prefix (1–5 characters)')
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(5)),

  async execute(interaction) {
    const prefix = interaction.options.getString('prefix');

    await query(
      'INSERT INTO guild_settings (guild_id, prefix) VALUES (?, ?) ON DUPLICATE KEY UPDATE prefix = VALUES(prefix)',
      [interaction.guild.id, prefix],
    );

    interaction.client.prefixCache.set(interaction.guild.id, prefix);
    await interaction.reply(`✅ Prefix updated to \`${prefix}\``);
  },
};
