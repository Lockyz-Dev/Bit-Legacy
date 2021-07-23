const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, reaction, user) => {

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildSettings';").get();
	if (!table['count(*)']) {
	  sql.prepare("CREATE TABLE guildSettings (guildID TEXT PRIMARY KEY, gwayEmote TEXT, gwayText TEXT, logsID TEXT, metrics TEXT, prefix TEXT, welcome TEXT, level TEXT, adminID TEXT, modID TEXT, muteID TEXT, suggestID TEXT);").run();
	  sql.pragma("synchronous = 1");
	  sql.pragma("journal_mode = wal");
	}
	client.getSettings = sql.prepare("SELECT * FROM guildSettings WHERE guildID = ?");
    client.setSettings = sql.prepare("INSERT OR REPLACE INTO guildSettings (guildID, gwayEmote, gwayText, logsID, metrics, prefix, welcomeID, level, adminID, modID, muteID, suggestID) VALUES (@guildID, @gwayEmote, @gwayText, @logsID, @metrics, @prefix, @welcomeID, @level, @adminID, @modID, @muteID, @suggestID);");
    
	let settings;
	
	settings = client.getSettings.get(reaction.message.guild.id);

    if(settings.suggestID === 'false') {
        return;
	} else {
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'suggestions';").get();
	    if (!table['count(*)']) {
	        sql.prepare("CREATE TABLE suggestions (messageID TEXT PRIMARY KEY, suggestion TEXT, denied TEXT, guildID TEXT, score TEXT, author TEXT").run();
	        sql.prepare("CREATE UNIQUE INDEX idx_scores_id ON scores (id);").run();
	        sql.pragma("synchronous = 1");
	        sql.pragma("journal_mode = wal");
	    }
	    client.getScore = sql.prepare("SELECT * FROM suggestions WHERE messageID = ?");
        client.setScore = sql.prepare("INSERT OR REPLACE INTO suggestions (messageID, suggestion, denied, guildID, score, author) VALUES (@messageID, @suggestion, @denied, @guildID, @score, @author);");
    
	    let score;
		
	    let more = client.getScore.get(reaction.message.id);

	    if (!more) {
			console.log('well shit...')
		    return;
	    }
    
	    if(reaction.emoji.name === "👍") {
            const pointsToAdd = 1;
		    more.score += pointsToAdd;
            await(client.setScore.run(more))
            const embed = new MessageEmbed()
                .setAuthor(more.author)
                .setColor(embedColor)
                .setTitle('Suggestion')
                .setDescription(more.suggestion)
                .addField('Likes', more.score)
                .setTimestamp();
            await(reaction.message.edit(embed))
        }
        if(reaction.emoji.name === "👎") {
            const pointsToAdd = 1;
		    more.score -= pointsToAdd;
            await(client.setScore.run(more))
            const embed = new MessageEmbed()
                .setAuthor(more.author)
                .setColor(embedColor)
                .setTitle('Suggestion')
                .setDescription(more.suggestion)
                .addField('Likes', more.score)
                .setTimestamp();
            await(reaction.message.edit(embed))
        }
    }
        
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
};