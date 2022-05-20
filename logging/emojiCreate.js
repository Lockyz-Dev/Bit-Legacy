const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'emojiCreate',
	execute(emoji) {
        const client = emoji.client

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(emoji.guild.id)
		let guildset = client.getGuSett.get(emoji.guild.id)
		
		if(!guildset) {
			guildset = { guildID: emoji.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true'}
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

			const embed = new MessageEmbed()
				.setAuthor("Emoji Created | "+emoji.name, emoji.url)
				.setColor(embedColor)
				embed.addField('Created By', emoji.author.username, true)
				embed.addField('Created Time', '<t:'+Math.floor(new Date(emoji.createdAt).getTime() / 1000)+'>', true)
				embed.setFooter('Emoji ID '+emoji.id)
				embed.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] });
			return;
		}
	},
};