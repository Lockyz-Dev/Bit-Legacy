const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js')
const locale = require('../locale/en-US.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Ask the 8ball a question and get an answer STRAIGHT from the cosmos. (Results Vary)')
		.addStringOption((option) => 
			option
				.setName('question')
				.setDescription('The important question you want answered.')
				.setRequired(true)
		),
	async execute(interaction) {

        const question = interaction.options.getString('question');
            var roll = [
                "id-01",
                "id-02",
                "id-03",
                "id-04",
                "id-05",
                "id-06",
                "id-07",
                "id-08",
                "id-09",
                "id-10",
                "id-11",
                "id-12",
                "id-13",
                "id-14",
                "id-15",
                "id-16",
                "id-17",
                "id-18",
                "id-19",
                "id-20"
            ]

            var answer = roll[Math.floor(Math.random()* roll.length)];
            const embed = new MessageEmbed()
                .setTitle(locale.magicBallName)
                .setDescription(locale.magicBallDescription)
                .addField(question, '\u200b')
                .setImage("https://db.lockyzdev.net/bots/commands/8ball/"+answer+".png")
                .setTimestamp();
            interaction.reply({ embeds: [embed] })
		}
};
