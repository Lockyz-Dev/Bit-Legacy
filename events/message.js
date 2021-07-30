const con = require("./ready.js")
const { MessageEmbed } = require('discord.js');
const { embedColor, prefix } = require('../info');
const SQLite = require("better-sqlite3");
const humanizeDuration = require('humanize-duration');
const sql = new SQLite('./bot.sqlite');

module.exports = async (client, message) => {
	const guild = message.guild;
    if (!guild) return;

	const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channelSettings';").get();
	client.getchanSet = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
    client.setchanSet = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, logsID, welcomeID, suggestID) VALUES (@guildID, @logsID, @welcomeID, @suggestID);");
    
	let chanSet;
	
	chanSet = client.getchanSet.get(guild.id);
		  
	if (!chanSet) {
		chanSet = { guildID: guild.id, logsID: "false", welcomeID: "false", suggestID: "false" };
		client.setchanSet.run(chanSet);
	}

	const table1 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'generalSettings';").get();
	client.getgenSet = sql.prepare("SELECT * FROM generalSettings WHERE guildID = ?");
    client.setgenSet = sql.prepare("INSERT OR REPLACE INTO generalSettings (guildID, prefix, gwayEmote, metrics, level) VALUES (@guildID, @prefix, @gwayEmote, @metrics, @level);");
    
	let genSet;
	
	genSet = client.getgenSet.get(guild.id);
		  
	if (!genSet) {
		genSet = { guildID: guild.id, prefix: "!", gwayEmote: "🎁", metrics: "false", level: "false" };
		client.setgenSet.run(genSet);
	}

	const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
	client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
    client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID) VALUES (@guildID, @adminID, @modID, @muteID);");
    
	let roleSet;
	
	roleSet = client.getroleSet.get(guild.id);

	if(!roleSet) {
		roleSet = { guildID: guild.id, adminID: "false", modID: "false", muteID: "false" };
		client.setroleSet.run(roleSet);
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

	if (message.author.bot) return;
	if(chanSet.suggestID === message.channel.id) {
        const embed = new MessageEmbed()
            .setAuthor(message.author.username)
            .setColor(embedColor)
            .setTitle('Suggestion')
            .setDescription(message.content)
            .addField('Likes', '0')
			.setTimestamp();
		async function replyAndLog() {
			let sent = await message.channel.send(embed); // this returns the message you just sent
			let id = sent.id; // you can get its ID with <Message>.id, as usually
		}
		message.delete();
		await message.channel.send(embed).then(sent => { // 'sent' is that message you just sent
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'suggestions';").get();
		client.getScore = sql.prepare("SELECT * FROM suggestions WHERE messageID = ?");
		client.setScore = sql.prepare("INSERT OR REPLACE INTO suggestions (messageID, suggestion, denied, guildID, score, author) VALUES (@messageID, @suggestion, @denied, @guildID, @score, @author);");
		
		let score;

		let id = sent.id;
		sugg = { messageID: sent.id, suggestion: message.content, denied: 'false', guildID: message.guild.id, score: 0, author: message.author.username };
		client.setSugg.run(sugg);
		sent.react('👍')
		sent.react('👎')
		return;
		});
	}

    let newPrefix = genSet.prefix

    if (message.mentions.has(client.user.id)) {
		if(message.mentions.has(message.guild.id)) return;
        message.channel.send('My Prefix for this guild is ' +genSet.prefix+'\n My Global Prefix is '+newPrefix)
    }

    const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

	const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
	
	if(genSet.level === 'true') {
    if (!cmd) {
		if(userSet.levels === 'true') {
		const cooldowns = new Map();
		const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'scores';").get();
		client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
		client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");
		
		let score;
		
		const cooldown = cooldowns.get(message.author.id);
		if (cooldown) {
  			const remaining = humanizeDuration(cooldown - Date.now());
  			return;
		}
		
		cooldowns.set(message.author.id, Date.now() + 60000);
		setTimeout(() => cooldowns.delete(message.author.id), 60000);

		score = client.getScore.get(message.author.id, guild.id);
		  
		if (!score) {
			score = { id: `${guild.id}-${message.author.id}`, user: message.author.id, guild: guild.id, points: 1, level: 0 };
        }
		
		//Point given can be anything from 0-5
		const pointsToAdd = Math.floor(Math.random() * 5);
		score.points += pointsToAdd;

		// Calculate the current level through MATH OMG HALP.
		//0.1 times(score.points squared) rounded down to the nearest whole
		const curLevel = Math.floor(0.1 * Math.sqrt(score.points));

		// Check if the user has leveled up, and let them know if they have:
		if(score.level < curLevel) {
  			//Level up!
			score.level++;
			//SEND THE TADA EMOTE BOT
			if(userSet.levelNotifs === 'true') {
				message.channel.send(`🎉${message.author.username} you've leveled up to level **${curLevel}**! Congrats🎉`);
			}
		}

		client.setScore.run(score);
			return;
		}}
	}

	if (message.content.indexOf(newPrefix) !== 0) return;
	if (!cmd) return;
	if(cmd) {
		switch (cmd.help.premium) {
			case 'true':
				message.channel.send('How you do this, this shouldn\'t happen...')
			break;
			default:
				switch (cmd.help.metrics) {
					case 'true':
						try{
							if(genSet.metrics === "true") {
								if(userSet.metrics === 'true') {
									const SQLite = require("better-sqlite3");
									const sql = new SQLite('../premium.sqlite');
			
									const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'commandmetrics';").get();
									client.getMetrics = sql.prepare("SELECT * FROM commandmetrics WHERE command = ?");
									client.setMetrics = sql.prepare("INSERT OR REPLACE INTO commandmetrics (command, usecount, servers) VALUES (@command, @usecount, @servers);");
				
									let metrics;
				
									metrics = client.getMetrics.get(cmd.help.name);
				
									if(!metrics) {
										metrics = { command: cmd.help.name, usecount: 1, servers: 1 };
										client.setMetrics.run(metrics);
										cmd.run(client, message, args);
										return;
									}
				
									const pointsToAdd = 1
									metrics.usecount += pointsToAdd;

									client.setMetrics.run(metrics);
								}
							}
							if(userSet.dataCollect === "false") {
								if(cmd.help.datause === "true") {
									message.channel.send('This Command requires data collection to be enabled.\nYou can enable data collection by using '+'`'+prefix+'settings user dataCollect true`')
								} else {
									cmd.run(client, message, args);
								}
							} else {
								cmd.run(client, message, args);
							}
						}
						catch(error) {
							message.channel.send(error)
						}
					break;
					case 'false':
						try {
							if(userSet.dataCollect === "false") {
								if(cmd.help.datause === "true") {
									message.channel.send('This Command requires data collection to be enabled.\nYou can enable data collection by using '+'`'+prefix+'settings user dataCollect true`')
								} else {
									cmd.run(client, message, args);
								}
							} else {
								cmd.run(client, message, args);
							}
						}
						catch(error) {
							message.channel.send(error)
						}
					break;
				}
			}
		}
};