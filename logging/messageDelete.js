const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, msg) => {
	let guild = msg.guild;
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
      if(msg.author.bot) return;
	const embed = new MessageEmbed()
        .setAuthor("Message Deleted | "+msg.author.username, msg.author.avatarURL())
        .setColor(embedColor)
        .addField('Deleted By', "Currently Unavailable", true)
        .addField('Channel', "<#"+msg.channel.id+">", true)
        .addField('@mention', '<@'+msg.author.id+'>', true)
		.addField('Message Content', msg.content)
		.setFooter('Message ID '+msg.id)
        .setTimestamp();
      client.channels.cache.get(score.logsID).send(embed);
}