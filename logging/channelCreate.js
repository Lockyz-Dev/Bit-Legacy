const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, channel, user) => {
	let guild = channel.guild;
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
	const embed = new MessageEmbed()
		.setAuthor("Channel Created | "+channel.name)
		.setColor(embedColor)
		.addField('Name', channel.name, true)
		.addField('Category', channel.parentID, true)
		.addField('Type', channel.type, true)
		.addField('Created By', "Currently Unavailable", true)
		.setFooter('Channel ID '+channel.id)
		.setTimestamp();
	client.channels.cache.get(score.logsID).send(embed);
	return;
}