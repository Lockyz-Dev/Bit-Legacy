const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

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
        const client = interaction.client
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        const question = interaction.options.getString('question');
            var roll = [
                ["01", locale.magicBallAnswer01],
                ["02", locale.magicBallAnswer02],
                ["03", locale.magicBallAnswer03],
                ["04", locale.magicBallAnswer04],
                ["05", locale.magicBallAnswer05],
                ["06", locale.magicBallAnswer06],
                ["07", locale.magicBallAnswer07],
                ["08", locale.magicBallAnswer08],
                ["09", locale.magicBallAnswer09],
                ["10", locale.magicBallAnswer10],
                ["11", locale.magicBallAnswer11],
                ["12", locale.magicBallAnswer12],
                ["13", locale.magicBallAnswer13],
                ["14", locale.magicBallAnswer14],
                ["15", locale.magicBallAnswer15],
                ["16", locale.magicBallAnswer16],
                ["17", locale.magicBallAnswer17],
                ["18", locale.magicBallAnswer18],
                ["19", locale.magicBallAnswer19],
                ["20", locale.magicBallAnswer20]
            ]

            var answer = roll[Math.floor(Math.random()* roll.length)];
            const embed = new MessageEmbed()
                .setTitle(locale.magicBallName)
                .setDescription(locale.magicBallDescription)
                .addField(question, answer[1])
                .setImage("https://db.lockyzdev.net/bots/commands/8ball/id-"+answer[0]+".png")
                .setTimestamp();
            interaction.reply({ embeds: [embed] })
		}
};
