const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Show information about a user')
    .addUserOption(opt =>
      opt.setName('user').setDescription('The user to look up (defaults to you)')),

  async execute(interaction) {
    const member = interaction.options.getMember('user') ?? interaction.member;
    const { user } = member;

    const roles = member.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(r => `<@&${r.id}>`)
      .slice(0, 10)
      .join(', ') || 'None';

    const embed = new EmbedBuilder()
      .setTitle(user.tag)
      .setThumbnail(user.displayAvatarURL())
      .setColor(member.displayColor || 0x5865F2)
      .addFields(
        { name: 'Display Name', value: member.displayName, inline: true },
        { name: 'ID', value: user.id, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: `Top Roles (${member.roles.cache.size - 1})`, value: roles },
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
