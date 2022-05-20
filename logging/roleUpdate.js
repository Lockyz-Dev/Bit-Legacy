const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'roleUpdate',
	execute(oldRole, newRole) {
		const client = newRole.client
		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(newRole.guild.id)
		let guildset = client.getGuSett.get(newRole.guild.id)
		
		if(!guildset) {
			guildset = { guildID: newRole.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

			var ncolor = newRole.color
			var ocolor = oldRole.color
			var nhoist = newRole.hoist
			var ohoist = oldRole.hoist
			var nmentionable = newRole.mentionable
			var omentionable = oldRole.mentionable
			var npermissions = newRole.permissions.FLAGS
			var opermissions = oldRole.permissions.FLAGS
			var nemoji = newRole.unicodeEmoji
			var oemoji = oldRole.unicodeEmoji
			var nname = newRole.name
			var oname = oldRole.name

			if(ncolor !== ocolor || nhoist !== ohoist || nmentionable !== omentionable || nname !== oname || npermissions !== opermissions || nemoji !== oemoji) {
				const embed = new MessageEmbed()
					.setAuthor('Role Edited | '+nname)
					.setColor(embedColor)
					if(nname !== oname) {
						embed.addField('Old Name', oname, true)
						embed.addField('New Name', nname, true)
						embed.addField('\u200B', '\u200B', true)
					} else {
						embed.addField('Name', nname, true)
						embed.addField('\u200B', '\u200B', true)
					}
					if(ncolor !== ocolor) {
						embed.addField('Old Colour', ocolor, true)
						embed.addField('New Colour', ncolor, true)
						embed.addField('\u200B', '\u200B', true)
					} else {
						embed.addField('Colour', ncolor, true)
						embed.addField('\u200B', '\u200B', true)
					}
					if(nhoist !== ohoist) {
						embed.addField('Was Hoisted?', ohoist, true)
						embed.addField('Is now Hoisted?', nhoist, true)
						embed.addField('\u200B', '\u200B', true)
					} else {
						embed.addField('Hoisted?', nhoist, true)
						embed.addField('\u200B', '\u200B', true)
					}
					if(nmentionable !== omentionable) {
						embed.addField('Was Mentionable?', omentionable, true)
						embed.addField('Is Mentionable Now?', nmentionable, true)
						embed.addField('\u200B', '\u200B', true)
					} else {
						embed.addField('Is Mentionable?', nmentionable, true)
						embed.addField('\u200B', '\u200B', true)
					}
					if(npermissions !== opermissions) {
						embed.addField('Old Permissions', opermissions, true)
						embed.addField('New Permissions', npermissions, true)
						embed.addField('\u200B', '\u200B', true)
					} else {
						embed.addField('Permissions', npermissions, true)
						embed.addField('\u200B', '\u200B', true)
					}
					if(nemoji !== oemoji) {
						if(oemoji) {
							embed.addField('Old Emoji', oemoji, true)
							if(nemoji) {
								embed.addField('New Emoji', nemoji, true)
								embed.addField('\u200B', '\u200B', true)
							} else {
								embed.addField('New Emoji', 'Emoji Removed', true)
								embed.addField('\u200B', '\u200B', true)
							}
						} else {
							embed.addField('Old Emoji', 'No Emoji', true)
							embed.addField('New Emoji', nemoji, true)
							embed.addField('\u200B', '\u200B', true)
						}
					} else {
						if(nemoji) {
							embed.addField('Emoji', nemoji, true)
							embed.addField('\u200B', '\u200B', true)
						}
					}
					embed.addField('Edited By', 'Currently Unavailable', true)
					embed.addField('Created By', 'Currently Unavailable', true)
					embed.addField('Created', '<t:'+Math.floor(new Date(oldRole.createdAt).getTime() / 1000)+'>', true)
					embed.setFooter('Role ID '+ newRole.id)
					embed.setTimestamp();
				client.channels.cache.get(logsID).send({ embeds: [embed] })
				return;
			}
		} else {
			return;
		}
	}
}