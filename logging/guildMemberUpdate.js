const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'guildMemberUpdate',
	execute(oldMember, newMember) {
        const client = newMember.client

		client.getChSett = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
		client.setChSett = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, loggingChannel, welcomeChannel) VALUES (@guildID, @loggingChannel, @welcomeChannel);");
		client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin, enableBoosts, enableLeave) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin, @enableBoosts, @enableLeave);");

		let chanset = client.getChSett.get(newMember.guild.id)
		let guildset = client.getGuSett.get(newMember.guild.id)

		if(!guildset) {
			guildset = { guildID: newMember.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false', enableBoosts: 'false', enableLeave: 'true' }
			client.setGuSett.run(guildset);
		}

		if(guildset.enableLogging === 'true') {
			var logsID = chanset.loggingChannel

            //Boost Logs
            if(oldMember.premiumSince === null && newMember.premiumSince !== null) {
                const embed = new MessageEmbed()
					.setAuthor("User Boosted | "+newMember.username, newMember.user.avatarURL())
					.setColor(embedColor)
					//.addField('Server Boost Count', newMember.guild.premiumSubscriptionCount)
					//.addField('Server Boost Tier', newMember.guild.premiumTier)
                client.channels.cache.get(logsID).send({ embeds: [embed] });
            }

            //Unboost Logs
			if(oldMember.premiumSince !== null && newMember.premiumSince === null) {
                const embed = new MessageEmbed()
					.setAuthor("User Unboosted | "+newMember.username, newMember.user.avatarURL())
					.setColor(embedColor)
					if(!newMember.guild.premiumSubscriptionCount) {
						embed.addField('Server Boost Count', '0', true)
						embed.addField('Server Boost Tier', '0', true)
					} else {
						//embed.addField('Server Boost Count', newMember.guild.premiumSubscriptionCount)
						//embed.addField('Server Boost Tier', newMember.guild.premiumTier)
					}
                client.channels.cache.get(logsID).send({ embeds: [embed] });
            }
        }
    }
}