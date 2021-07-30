const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, member) => {
	let guild = member.guild;
	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channelSettings';").get();
	client.getScore = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, logsID, welcomeID, suggestID) VALUES (@guildID, @logsID, @welcomeID, @suggestID);");
    
	let score;
	
	score = client.getScore.get(guild.id);
		  
	if (!score) {
		score = { guildID: guild.id };
	}

	if(score.logsID === 'false') {
		return;
	}

	const table3 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userSettings';").get();
	client.getuserSet = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
    client.setuserSet = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, metrics, levels, news, levelNotifs, dataCollect) VALUES (@userID, @metrics, @levels, @news, @levelNotifs, @dataCollect);");
    
	let userSet;
	
	userSet = client.getuserSet.get(message.author.id);

	if(!userSet) {
		userSet = { userID: message.author.id, metrics: "true", levels: 'true', news: 'true', levelNotifs: 'true', dataCollect: 'false' };
		client.setuserSet.run(userSet);
	}

	if(userSet.dataCollect === 'true')  {
		const embed = new MessageEmbed()
			.setAuthor("Member Left | "+member.user.username, member.user.avatarURL())
			.setColor(embedColor)
			.addField('Invited By', "Currently Unavailable", true)
			.addField('@mention', '<@'+member.id+'>', true)
			.setFooter('User ID '+ member.id)
			.setTimestamp();
		client.channels.cache.get(score.logsID).send(embed);
	} else {
		const embed = new MessageEmbed()
			.setTitle("Member Left | "+member.id)
			.setColor(embedColor)
			.setDescription('A member left however they have data collection disabled.')
			.setTimestamp();
		client.channels.cache.get(score.logsID).send(embed);
	}
}