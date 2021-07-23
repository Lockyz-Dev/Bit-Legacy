const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
	if (!table['count(*)']) {
	  sql.prepare("CREATE TABLE scores (id TEXT PRIMARY KEY, user TEXT, guild TEXT, points INTEGER, level INTEGER);").run();
	  sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
	  sql.pragma("synchronous = 1");
	  sql.pragma("journal_mode = wal");
	}
	client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
    
    let score;
	
	if (message.guild) {

		score = client.getScore.get(message.author.id, message.guild.id);
		  
		if (!score) {
			score = { id: `${message.guild.id}-${message.author.id}`, user: message.author.id, guild: message.guild.id, points: 0, level: 0 };
        }
        // Grab the thing
	  		const top10 = sql.prepare("SELECT * FROM scores WHERE guild = ? ORDER BY points DESC LIMIT 10;").all(message.guild.id);
  
	  		// Now shake it and show it! (as a nice embed, too!)
	  		const embed = new MessageEmbed()
				.setTitle("Top Ten")
				.setAuthor(client.user.username, client.user.avatarURL())
				.setDescription("Our top 10 points leaders!")
				.setColor(0x00AE86);
  
	  		for(const data of top10) {
				embed.addField(client.users.cache.get(data.user).username, `${data.points} points (level ${data.level})`);
	  		}
	  		return message.channel.send({embed});
    }
	message.delete(1000);
};

exports.help = {
    name: 'top10',
    aliases: ['leaderboard', 't10'],
    description: 'Show the top 10 point getters.',
    usage: 'top10',
    premium: 'false',
    metrics: 'true',
    category: 'level'
};