const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'channelUpdate',
	execute(oldChannel, newChannel) {
		const client = newChannel.client

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.setChSett = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, loggingChannel, welcomeChannel) VALUES (@guildID, @loggingChannel, @welcomeChannel);");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin);");

		let chanset = client.getChSett.get(newChannel.guild.id)
		let guildset = client.getGuSett.get(newChannel.guild.id)

		if(!guildset) {
			guildset = { guildID: newChannel.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel
			const embed = new MessageEmbed()
					.setAuthor("Channel Updated | "+oldChannel.name)
					.setColor(embedColor)

			if(newChannel.name) {
				var nname = newChannel.name
				var oname = oldChannel.name
				embed.addField('Old Name', oname, true)
				embed.addField('Name', nname, true)
				embed.addField('\u200B', '\u200B', true)
			} else {
				embed.addField('Name', oldChannel.name, true)
			}
			if(newChannel.parent.name) {
				var nparent = newChannel.parent.name
				var oparent = oldChannel.parent.name
				embed.addField('Old Category', oparent, true)
				embed.addField('Category', nparent, true)
				embed.addField('\u200B', '\u200B', true)
			} else if(oldChannel.parent) {
				embed.addField('Category', oldChannel.parent.name, true)
			}
			if(newChannel.type) {
				var ntype = newChannel.type
				var otype = oldChannel.type

				embed.addField('Old Type', otype, true)
				embed.addField('Type', ntype, true)
				embed.addField('\u200B', '\u200B', true)
			} else {
				embed.addField('Type', oldChannel.type, true)
			}
			embed.addField('Edited By', "Currently Unavailable", true)
			embed.addField('Created Time', '<t:'+Math.floor(new Date(oldChannel.createdAt).getTime() / 1000)+'>', true)
			embed.addField('Edited Time', '<t:'+Math.floor(new Date(newChannel.createdAt).getTime() / 1000)+'>', true)
			embed.setFooter('Channel ID '+newChannel.id)
			embed.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] });
			return;
		}
	}
}