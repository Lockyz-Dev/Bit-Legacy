const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'guildBanAdd',
	execute(ban) {
		const client = ban.client
		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(ban.guild.id)
		let guildset = client.getGuSett.get(ban.guild.id)
		
		if(!guildset) {
			guildset = { guildID: ban.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

			const embed = new MessageEmbed()
				.setAuthor("Member Banned | "+ban.user.username, ban.user.avatarURL())
				.setColor(embedColor)
				.addField('Banned By', 'Currently Unavailable', true)
				if(ban.reason) {
					embed.addField('Ban Reason', ban.reason, true)
				} else {
					embed.addField('Ban Reason', 'No reason specified', true)
				}
				embed.setTimestamp()
				embed.setFooter('Ban ID '+'Currently Unavailable')
			client.channels.cache.get(logsID).send({ embeds: [embed] })
			return;
		} else {
			return;
		}
	}
}