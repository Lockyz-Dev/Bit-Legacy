const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'guildMemberRemove',
	execute(member) {
		const client = member.client
		const user = member.user

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(member.guild.id)
		let guildset = client.getGuSett.get(member.guild.id)
		
		if(!guildset) {
			guildset = { guildID: member.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

			const embed = new MessageEmbed()
				.setAuthor('Member Left | '+user.username, user.avatarURL())
				.setColor(embedColor)
				.addField('Invited By', "Currently Unavailable", true)
				.addField('@mention', '<@'+member.id+'>', true)
				.setFooter('User ID '+ member.id)
				.setTimestamp();
			client.channels.cache.get(logsID).send({ embeds: [embed] })
			return;
		}

		if(guildset.enableLeave === 'true') {
			var leaveChan = chanset.leaveChannel

			client.channels.cache.get(leaveChan).send({ content: member.username+' Left :(' })
		}
	}
}