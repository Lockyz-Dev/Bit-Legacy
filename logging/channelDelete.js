const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'channelDelete',
	execute(channel) {
		const client = channel.client

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin);");

		let chanset = client.getChSett.get(channel.guild.id)
		let guildset = client.getGuSett.get(channel.guild.id)
		
		if(!guildset) {
			guildset = { guildID: channel.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

			const embed = new MessageEmbed()
				.setAuthor("Channel Deleted | "+channel.name)
				.setColor(embedColor)
				.addField('Name', channel.name, true)
				.addField('Category', channel.parent.name, true)
				.addField('Type', channel.type, true)
				.addField('Created By', "Currently Unavailable", true)
				.addField('Created Time', '<t:'+Math.floor(new Date(channel.createdAt).getTime() / 1000)+'>', true)
				.setFooter('Channel ID '+channel.id)
				.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] });
			return;
		} else {
			return;
		}
	}
}