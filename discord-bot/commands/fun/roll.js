const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a die')
    .addIntegerOption(opt =>
      opt.setName('sides').setDescription('Number of sides (default: 6)').setMinValue(2).setMaxValue(1000))
    .addIntegerOption(opt =>
      opt.setName('count').setDescription('Number of dice to roll (default: 1)').setMinValue(1).setMaxValue(20)),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const count = interaction.options.getInteger('count') ?? 1;
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);
    const rollStr = rolls.join(', ');
    const msg = count > 1
      ? `🎲 Rolled ${count}d${sides}: [${rollStr}] = **${total}**`
      : `🎲 Rolled 1d${sides}: **${rolls[0]}**`;
    await interaction.reply(msg);
  },
};
