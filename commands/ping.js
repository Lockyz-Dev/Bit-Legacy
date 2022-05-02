const { SlashCommandBuilder } = require('@discordjs/builders');
const locale = require('../locale/en-US.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        await interaction.reply('Ping?');
        interaction.editReply(`Pong! Latency is \`${interaction.createdTimestamp - new Date()}ms\`. API Latency is \`${Math.round(interaction.client.ws.ping)}ms\`.`);
	},
};
