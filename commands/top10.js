const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('top10')
		.setDescription('Get current top 10 point leaders.'),
	async execute(interaction) {
        const client = interaction.client
        var lan = 'en'
        client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
        let guildset = client.getGuSett.get(interaction.guild.id)

        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        if(!guildset) {
            interaction.reply({ content: locale.xpDisabled})
            return;
        }
        if(guildset.enableXP !== "true") {
            interaction.reply({ content: locale.xpDisabled})
            return;
        }

	    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");

        let score;

        if(interaction.guild) {
            
            score = client.getScore.get(interaction.user.id, interaction.guild.id);

            if(!score) {
                score = { id: `${interaction.guild.id}-${interaction.user.id}`, user: interaction.user.id, guild: interaction.guild.id, points: 0, level: 0 };
            }

            const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(interaction.guild.id);

            const embed = new MessageEmbed()
				.setTitle("Top Ten")
				.setDescription("Our top 10 points leaders!")
				.setColor(embedColor);
  
	  		for(const data of top10) {
				embed.addField('\u200b', '<@'+data.user+'> '+data.points +' points (level '+data.level+')');
	  		}
	  		return interaction.reply({ embeds: [embed] });
        }
	}
};
