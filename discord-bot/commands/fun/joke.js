const { SlashCommandBuilder } = require('discord.js');

const jokes = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything!" },
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "Why can't you give Elsa a balloon?", punchline: "Because she'll let it go." },
  { setup: "What do you call a fake noodle?", punchline: "An impasta." },
  { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field." },
  { setup: "I'm reading a book about anti-gravity.", punchline: "It's impossible to put down." },
  { setup: "Did you hear about the mathematician who's afraid of negative numbers?", punchline: "He'll stop at nothing to avoid them." },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up." },
  { setup: "What's a computer's favorite snack?", punchline: "Microchips." },
  { setup: "I would tell you a construction joke...", punchline: "But I'm still working on it." },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),

  async execute(interaction) {
    const { setup, punchline } = jokes[Math.floor(Math.random() * jokes.length)];
    await interaction.reply(`😄 **${setup}**\n||${punchline}||`);
  },
};
