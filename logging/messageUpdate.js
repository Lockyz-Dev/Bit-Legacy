const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, oldMsg, newMsg) => {
	let guild = newMsg.guild;
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

  if(oldMsg.author.bot) return;
  if(newMsg.content == oldMsg.content) return;
  if(!oldMsg.content) return;
	if(!newMsg.content) return;
	const embed = new MessageEmbed()
    .setAuthor("Message Edited | "+oldMsg.author.username, oldMsg.author.avatarURL())
    .setColor(embedColor)
    .setDescription('[Jump To]('+newMsg.url+')')
    .addField('Channel', "<#"+newMsg.channel.id+">", true)
    .addField('@mention', '<@'+newMsg.author.id+'>', true)
    .addField('Message Created', oldMsg.created, true)
    .addField('Old Content', oldMsg.content)
	.addField('New Content', newMsg.content)
    .setTimestamp();
  client.channels.cache.get(score.logsID).send(embed);
  return;
};