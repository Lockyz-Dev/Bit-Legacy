const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'messageUpdate',
	execute(oldMessage, newMessage) {
		const client = newMessage.client
		const user = newMessage.user

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(oldMessage.guild.id)
		let guildset = client.getGuSett.get(oldMessage.guild.id)
		
		if(!guildset) {
			guildset = { guildID: oldMessage.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel
			if(newMessage.content == oldMessage.content) return;
    		if(!oldMessage.content) return;
    		if(!newMessage.content) return;
			const embed0 = new MessageEmbed()
				.setAuthor("Message Edited | "+newMessage.author.username, newMessage.author.avatarURL())
				.setColor(embedColor)
				.setDescription('[Jump To]('+newMessage.url+')')
				.addField('Channel', '<#'+newMessage.channel.id+'>', true)
				.addField('Author', '<@'+newMessage.author.id+'>', true)
				.addField('Message Created', '<t:'+Math.floor(new Date(oldMessage.createdAt).getTime() / 1000)+'>', true)
				if(oldMessage.cleanContent.length > 1024) {
					embed0.addField('Old Content', 'Old Content is over 1024 lines, it\'s in a new embed')
				} else if(oldMessage.cleanContent.length > 1) {
					embed0.addField('Old Content', oldMessage.cleanContent)
				} else {
					embed0.addField('Old Content', 'Old message content was not cached so it cannot be displayed')
				}
				if(newMessage.cleanContent.length > 1024) {
					embed0.addField('New Content', 'New Content is over 1024 lines, it\'s in a new embed')
				} else if(newMessage.cleanContent.length > 1) {
					embed0.addField('New Content', newMessage.cleanContent)
				} else {
					embed0.addField('New Content', 'Old message content was not cached so it cannot be displayed')
				}
				embed0.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed0] })
			if(oldMessage.cleanContent.length > 1024) {
				const embed1 = new MessageEmbed()
					.setAuthor("Message Edited")
					.setTitle("Old Message Content")
					.setColor(embedColor)
					.setDescription(oldMessage.cleanContent)
				client.channels.cache.get(logsID).send({ embeds: [embed1] })
			}
			if(newMessage.cleanContent.length > 1024) {
				const embed2 = new MessageEmbed()
					.setAuthor("Message Edited")
					.setTitle("New Message Content")
					.setColor(embedColor)
					.setDescription(newMessage.cleanContent)
				client.channels.cache.get(logsID).send({ embeds: [embed2] })
			}
			return;
		}
		else {
			return;
		}
	}
}