const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { embedColor, ownerID } = require('../config');
const owospeak = require("owospeak");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

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
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')
        const message = interaction.options.getString('message_id');

        interaction.reply({ content: owospeak.convert(locale.owoWait, { stutter: true, tilde: true }) })

        setTimeout(function(){
            interaction.channel.messages.fetch(message)
            .then(message => interaction.editReply({ content: owospeak.convert(message.cleanContent, { stutter: true, tilde: true })}))
            .catch(console.error);
        }, 5000)
	}
};
