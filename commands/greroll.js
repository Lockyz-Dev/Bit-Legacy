const { noBotPerms } = require('../utils/errors');
const ms = require('ms');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {
    const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
	client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
    client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID, autoID) VALUES (@guildID, @adminID, @modID, @muteID, @autoID);");
    
	let roleSet;
	
	roleSet = client.getroleSet.get(guild.id);

    if(message.author.id === message.guild.ownerID || message.member.roles.cache.has(roleSet.adminID) || message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_GUILD')) {    
        
    if(!args[0]){
        return message.channel.send(':x: You have to specify a valid message ID!')
    }

    let giveaway = 
    client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    if(!giveaway){
        return message.channel('Unable to find a giveaway for `'+args.join(' ')+'`')
    }

    client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        message.channel.send('Giveaway rerolled!')
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('This giveaway is not ended!')
        } else {
            console.error(e);
            message.channel.send('An error occured...')
        }
    }); 
    } else {
        message.channel.send(`you don't have the permission to use this command`)
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