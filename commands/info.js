const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js')
const locale = require('../locale/en-US.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Get advanced information about the bot.'),
	async execute(interaction) {
        const client = interaction.client
        
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