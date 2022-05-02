const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'messageDelete',
	execute(message) {
		const client = message.client
		const user = message.user

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin);");

		let chanset = client.getChSett.get(message.guild.id)
		let guildset = client.getGuSett.get(message.guild.id)
		
		if(!guildset) {
			guildset = { guildID: message.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel
			const embed0 = new MessageEmbed()
				.setAuthor("Message Deleted | "+message.author.username, message.author.avatarURL())
				.setColor(embedColor)
				.setDescription('[Jump To]('+message.url+')')
				.addField('Channel', '<#'+message.channel.id+'>', true)
				.addField('Author', '<@'+message.author.id+'>', true)
				.addField('Message Created', '<t:'+Math.floor(new Date(message.createdAt).getTime() / 1000)+'>', true)
				if(message.cleanContent.length > 1024) {
					embed0.addField('Content', 'Old Content is over 1024 lines, it\'s in a new embed')
				} else if(message.cleanContent.length > 1) {
					embed0.addField('Content', message.cleanContent)
				} else {
					embed0.addField('Content', 'Message Content was not cached so it cannot be displayed')
				}
				embed0.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed0] })
			if(message.cleanContent.length > 1024) {
				const embed1 = new MessageEmbed()
					.setAuthor("Message Deleted")
					.setTitle("Message Content")
					.setColor(embedColor)
					.setDescription(message.cleanContent)
				client.channels.cache.get(logsID).send({ embeds: [embed1] })
			}
			return;
		} else {
			return;
		}
	}
}