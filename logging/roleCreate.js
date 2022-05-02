const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'roleCreate',
	execute(role) {
		const client = role.client

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin);");

		let chanset = client.getChSett.get(role.guild.id)
		let guildset = client.getGuSett.get(role.guild.id)
		
		if(!guildset) {
			guildset = { guildID: role.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
		var logsID = chanset.loggingChannel
			const embed = new MessageEmbed()
				.setAuthor("Role Created | "+ role.name)
				.setColor(embedColor)
				.addField('Name', role.name, true)
				.addField('Colour', role.color, true)
				.addField('Hoisted?', role.hoist, true)
				.addField('Mentionable?', role.mentionable, true)
				.addField('Permissions', role.permissions.FLAGS, true)
				if(role.unicodeEmoji) {
					embed.addField('Emoji', role.unicodeEmoji, true)
				}
				embed.addField('Created By', "Currently Unavailable", true)
				embed.addField('Created', '<t:'+Math.floor(new Date(role.createdAt).getTime() / 1000)+'>', true)
				embed.setFooter('Role ID '+ role.id)
				embed.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] })
			return;
		} else {
			return;
		}
	}
}