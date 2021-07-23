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
        
    if(!args[0]){
        return message.channel.send(':x: You have to specify a valid message ID!')
        .then(msg => {
            msg.delete(20000)
        })
    }

    let giveaway = 
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    if(!giveaway){
        return message.channel('Unable to find a giveaway for `'+args.join(' ')+'`')
        .then(msg => {
            msg.delete(20000)
        })
    }

    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        message.channel.send('Giveaway rerolled!')
        .then(msg => {
            msg.delete(20000)
        })
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('This giveaway is not ended!')
            .then(msg => {
                msg.delete(20000)
            })
        } else {
            console.error(e);
            message.channel.send('An error occured...')
            .then(msg => {
                msg.delete(20000)
            })
        }
    }); 
    } else {
        message.channel.send(`you don't have the permission to use this command`)
        .then(msg => {
            msg.delete(20000)
        })
        return;
      }
};

exports.help = {
    name: 'greroll',
    aliases: [],
    description: 'Reroll a giveaway.',
    usage: 'greroll {Stuffs}',
    premium: 'false',
    metrics: 'true',
    category: 'giveaway'
};