const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const NUMBER_EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(opt =>
      opt.setName('question').setDescription('The poll question').setRequired(true))
    .addStringOption(opt =>
      opt.setName('option1').setDescription('Option 1').setRequired(true))
    .addStringOption(opt =>
      opt.setName('option2').setDescription('Option 2').setRequired(true))
    .addStringOption(opt =>
      opt.setName('option3').setDescription('Option 3 (optional)'))
    .addStringOption(opt =>
      opt.setName('option4').setDescription('Option 4 (optional)')),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = [1, 2, 3, 4]
      .map(n => interaction.options.getString(`option${n}`))
      .filter(Boolean);

    const description = options.map((opt, i) => `${NUMBER_EMOJIS[i]} ${opt}`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle(`📊 ${question}`)
      .setDescription(description)
      .setColor(0x5865F2)
      .setFooter({ text: `Poll by ${interaction.user.tag}` })
      .setTimestamp();

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (let i = 0; i < options.length; i++) {
      await msg.react(NUMBER_EMOJIS[i]);
    }
  },
};
