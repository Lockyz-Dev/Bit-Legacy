const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'channelCreate',
	execute(channel) {
		const client = channel.client

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(channel.guild.id)
		let guildset = client.getGuSett.get(channel.guild.id)
		
		if(!guildset) {
			guildset = { guildID: channel.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true'}
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

			const embed = new MessageEmbed()
				.setAuthor("Channel Created | "+channel.name)
				.setColor(embedColor)
				.addField('Name', channel.name, true)
				if(channel.parent) {
				embed.addField('Category', channel.parent.name, true)
				}
				embed.addField('Type', channel.type, true)
				embed.addField('Created By', "Currently Unavailable", true)
				embed.addField('Created Time', '<t:'+Math.floor(new Date(channel.createdAt).getTime() / 1000)+'>', true)
				embed.setFooter('Channel ID '+channel.id)
				embed.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] });
			return;
		}
	}
}