const { noBotPerms } = require('../utils/errors');
const ms = require('ms');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'guildSettings';").get();
	if (!table['count(*)']) {
	  sql.prepare("CREATE TABLE guildsettings (guildID TEXT PRIMARY KEY, gwayEmote TEXT, gwayText TEXT, logsID TEXT, metrics TEXT, prefix TEXT, welcome TEXT, adminID TEXT, modID TEXT, muteID TEXT, suggestID TEXT);").run();
	  sql.pragma("synchronous = 1");
	  sql.pragma("journal_mode = wal");
	}
	client.getSettings = sql.prepare("SELECT * FROM guildsettings WHERE guildID = ?");
	client.setSettings = sql.prepare("INSERT OR REPLACE INTO guildsettings (guildID, gwayEmote, gwayText, logsID, metrics, prefix, welcomeID, level, adminID, modID, muteID, suggestID) VALUES (@guildID, @gwayEmote, @gwayText, @logsID, @metrics, @prefix, @welcomeID, @level, @adminID, @modID, @muteID, @suggestID);");

    let guildsettings;

    guildsettings = client.getSettings.get(message.guild.id);

    if(!guildsettings) {
        guildsettings = { guildID: message.guild.id, gwayEmote: "🎁", gwayText: "Test", logsID: 'false', metrics: 'false', prefix: '?', welcome: 'false', level: 'false', adminID: 'false', modID: 'false', muteID: 'false', suggestID: 'false' };
        client.setSettings.run(guildsettings);
    }

    if(message.author.id === message.guild.ownerID || message.member.roles.cache.has(guildsettings.adminID) || message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_GUILD')) {    
        
    let giveawayChannel = message.mentions.channels.first();
    if(!giveawayChannel){
        return message.channel.send(':x: You have to mention a valid channel!')
        .then(msg => {
            msg.delete()
        })
    }

    let giveawayDuration = args[1];
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(':x: You have to specify a valid duration!')
        .then(msg => {
            msg.delete()
        })
    }

    let giveawayNumberWinners = args[2];
    if(isNaN(giveawayNumberWinners)){
        return message.channel.send(':x: You have to specify a valid number of winners!')
        .then(msg => {
            msg.delete()
        })
    }

    let giveawayPrize = args.slice(3).join(' ');
    if(!giveawayPrize){
        return message.channel.send(':x: You have to specify a valid prize!')
        .then(msg => {
            msg.delete()
        })
    }

    client.giveawaysManager.start(giveawayChannel, {
        time: ms(giveawayDuration),
        prize: giveawayPrize,
        winnerCount: giveawayNumberWinners,
        messages: {
            giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎁 to participate!",
            winMessage: "Congratulations, {winners}! You won **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, no valid participations.",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });   
    } else {
        message.channel.send(`you don't have the permission to use this command`)
        .then(msg => {
            msg.delete()
        })
        return;
    }
};

exports.help = {
    name: 'gcreate',
    aliases: [],
    description: 'Create a giveaway.',
    usage: 'gcreate {Channel Mention} {Duration} {Number of Winners} {Prize}',
    premium: 'false',
    metrics: 'true',
    category: 'giveaway'
};