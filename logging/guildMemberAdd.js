const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, member) => {
	let guild = member.guild;
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channelSettings';").get();
	client.getguildSet = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
    client.setguildSet = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, logsID, welcomeID, suggestID) VALUES (@guildID, @logsID, @welcomeID, @suggestID);");
    
	let guildSet;
	
	guildSet = client.getguildSet.get(guild.id);

	const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
	client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
    client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID, autoID) VALUES (@guildID, @adminID, @modID, @muteID, @autoID);");
    
	let roleSet;
	
	roleSet = client.getroleSet.get(guild.id);

	if(roleSet.autoID === 'false')
	{} else {
		member.roles.add(roleSet.autoID)
	}

	if(guildSet.welcomeID !== 'false') {
		const embed = new MessageEmbed()
			.setAuthor(guild.name, guild.iconURL())
			.setDescription('Welcome <@'+member.user.id+'> to '+guild.name)
			.setColor(embedColor)
			.setTimestamp();
		client.channels.cache.get(guildSet.welcomeID).send(member.user, embed);
	}

	if(guildSet.logsID === 'false') {
		return;
	}

	const embed = new MessageEmbed()
		.setAuthor("Member Joined | "+member.user.username, member.user.avatarURL())
		.setColor(embedColor)
		.addField('Invited By', "Currently Unavailable", true)
		.addField('@mention', '<@'+member.id+'>', true)
		.setFooter('User ID '+ member.id)
		.setTimestamp();
	client.channels.cache.get(guildSet.logsID).send(embed);
}