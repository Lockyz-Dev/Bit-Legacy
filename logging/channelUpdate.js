const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, newChannel, oldChannel, user) => {
	let guild = oldChannel.guild;
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
	var nname = newChannel.name
	var oname = oldChannel.name
	var nparent = newChannel.parentID
	var oparent = oldChannel.parentID
	var ntype = newChannel.type
	var otype = oldChannel.type

	if(nname !== oname || nparent !== oparent || ntype !== otype) {
		const embed = new MessageEmbed()
			.setAuthor("Channel Updated | " + oname)
			.setColor(embedColor)
			.addField('Old Name', nname, true)
			.addField('Name', oname, true)
			.addField('\u200B', '\u200B', true)
			.addField('Old Category', nparent, true)
			.addField('Category', oparent, true)
			.addField('\u200B', '\u200B', true)
			.addField('Old Type', ntype, true)
			.addField('Type', otype, true)
			.addField('\u200B', '\u200B', true)
        	.addField('Edited By', "Currently Unavailable", true)
        	.setFooter('Channel ID '+newChannel.id)
			.setTimestamp();
		client.channels.cache.get(score.logsID).send(embed);
		return;
	}
}