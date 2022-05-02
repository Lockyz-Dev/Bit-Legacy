const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { embedColor, ownerID } = require('../config');
const owospeak = require("owospeak");
const locale = require('../locale/en-US.json')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('owoify')
		.setDescription('UwU wats dis? You want t-to owoify a message? Oh Senpai-san-.- p-pwease u-use me.')
        .addStringOption((option) =>
            option
                .setName('message_id')
                .setDescription('What message wouwd you w-wike to o-owoify senpai-san?')
                .setRequired(true)
        ),
	async execute(interaction) {
        const client = interaction.client
        const message = interaction.options.getString('message_id');

        //const uwuify = new uwuifier();

        interaction.reply({ content: owospeak.convert('Give me just a second senpai-san. I enjoy it when you use me.', { stutter: true, tilde: true }) })

        setTimeout(function(){
            interaction.channel.messages.fetch(message)
            .then(message => interaction.editReply({ content: owospeak.convert(message.cleanContent, { stutter: true, tilde: true })}))
            .catch(console.error);
        }, 5000)
	}
};
