const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const locale = require('../locale/en-US.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('privacy')
		.setDescription('Get privacy and data collection information.'),
	async execute(interaction) {
        interaction.reply({ content: 'This bot was created by Lockyz Dev, we do not store any user information without prior consent. We also will not store any information for persons under the age of 13 as per Australian law.\nBy using our services you agree to the use of privatised data needed to access the Discord API. If you would like us to exclude you from any sort of data useage please DM our Admin "Robin Painter" and let her know.\n\nYou\'re welcome to view a more in-depth version of our privacy policy at: <https://lockyzdev.net/privacy>' })
	}
};
