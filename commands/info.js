const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get advanced information about the bot.'),
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
        
        var d = new Date();
        var n = d.getFullYear();
        const embed = new MessageEmbed()
            .setTitle(locale.infoEmbedTitle)
            .setDescription(locale.infoEmbedDescription)
            .addField(locale.infoFieldSupport, 'https://discord.gg/eRPsZns')
            .addField(locale.infoFieldDev, 'Robin Painter')
            .setFooter("©2018-"+n+" Lockyz Dev");
        interaction.reply({ embeds: [embed] })
	}
};