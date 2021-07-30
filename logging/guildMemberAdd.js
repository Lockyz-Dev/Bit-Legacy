const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const message = require('../events/message');
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

	const table3 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userSettings';").get();
	client.getuserSet = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
    client.setuserSet = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, metrics, levels, news, levelNotifs, dataCollect) VALUES (@userID, @metrics, @levels, @news, @levelNotifs, @dataCollect);");
    
	let userSet;
	
	userSet = client.getuserSet.get(message.author.id);

	if(!userSet) {
		userSet = { userID: message.author.id, metrics: "true", levels: 'true', news: 'true', levelNotifs: 'true', dataCollect: 'false' };
		client.setuserSet.run(userSet);
	}

	if(roleSet.autoID === 'false')
	{} else {
		member.roles.add(roleSet.autoID)
	}

	if(userSet.dataCollect === 'true') {
		if(guildSet.welcomeID !== 'false') {
			const embed = new MessageEmbed()
				.setAuthor(guild.name, guild.iconURL())
				.setDescription('Welcome <@'+member.user.id+'> to '+guild.name)
				.setColor(embedColor)
				.setTimestamp();
			client.channels.cache.get(guildSet.welcomeID).send(member.user, embed);
		}
		if(guildSet.logsID === 'false') {
		} else {
			const embed = new MessageEmbed()
				.setAuthor("Member Joined | "+member.user.username, member.user.avatarURL())
				.setColor(embedColor)
				.addField('Invited By', "Currently Unavailable", true)
				.addField('@mention', '<@'+member.id+'>', true)
				.setFooter('User ID '+ member.id)
				.setTimestamp();
			client.channels.cache.get(guildSet.logsID).send(embed);
		}
	} else {
		if(guildSet.logsID === 'false') {}
		else {
			const embed = new MessageEmbed()
				.setAuthor("Member Joined | "+ member.id)
				.setColor(embedColor)
				.setDescription('A member joined however they have data collection disabled.')
				.setTimestamp();
			client.channels.cache.get(guildSet.logsID).send(embed);
		}
	}
}