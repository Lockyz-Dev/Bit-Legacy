const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
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
        var nextLevel = score.level+1;
        //Basically it's score.level+1 divided by 0.1 too the power of 2 *Written in order of when it's done... BODMAS is not taken into account*
        var pointsNeed = Math.floor(Math.pow(((score.level+1)/0.1),2));
        // Create Embed
			const embed = new MessageEmbed()
            .setTitle("Points")
            .setAuthor(client.user.username, client.user.avatarURL())
            // get score.level and send it as a Points Field
            .addField("Current Level", score.level, true)
            // get score.points and send it as a Points Field
            .addField("Points", score.points, true)
            //get score.level and add 1
            .addField("Next Level", score.level+1, true)
            .addField("Points needed for level "+ nextLevel, `${pointsNeed} points`, true)
            .setFooter('Requested by: '+message.author.username)
            .setColor(0x00AE86);
        //Send the Embed
        return message.channel.send(embed);
    }
    message.delete(1000);
};

exports.help = {
    name: 'points',
    aliases: ['pts', 'score'],
    description: 'Get your points.',
    usage: 'points',
    premium: 'false',
    metrics: 'true',
    category: 'level'
};