const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, newRole, oldRole, user) => {
	let guild = newRole.guild;
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
	if(newRole == oldRole) {
		return;
	}

	var ncolor = newRole.color
	var ocolor = oldRole.color
	var nhoist = newRole.hoist
	var ohoist = oldRole.hoist
	var nmentionable = newRole.mentionable
	var omentionable = oldRole.mentionable
	var nname = newRole.name
	var oname = oldRole.name

	if(ncolor !== ocolor || nhoist !== ohoist || nmentionable !== omentionable || nname !== oname) {
		const embed = new MessageEmbed()
			.setAuthor("Role Updated | "+ oname)
			.setColor(embedColor)
			.addField('Old Name', nname, true)
			.addField('Name', oname, true)
			.addField('\u200B', '\u200B', true)
			.addField('Old Colour', ncolor, true)
			.addField('Colour', ocolor, true)
			.addField('\u200B', '\u200B', true)
			.addField('Hoisted?', ohoist, true)
			.addField('Mentionable?', omentionable, true)
			.addField('\u200B', '\u200B', true)
			.addField('Updated By', "Currently Unavailable", true)
			.setFooter('Role ID '+ newRole.id)
			.setTimestamp();
		client.channels.cache.get(score.logsID).send(embed);
		return;
	}
}