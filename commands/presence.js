const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'botsettings';").get();
	client.getSettings = sql.prepare("SELECT * FROM botsettings WHERE botID = ?");
	client.setSettings = sql.prepare("INSERT OR REPLACE INTO botsettings (botID, prefix, presenceType, presenceName, embedColor, ownerID, isNews, newsTitle, newsText) VALUES (@botID, @prefix, @presenceType, @presenceName, @ownerID, @isNews, @newsTitle, @newsText, @embedColor);");

    let botSet;

    botSet = client.getSettings.get("771225733007802369");

    if(message.author.id === '835394949612175380') {
        if(!args.length) {
            botSet.presenceName = 'Helping you UwU'
            botSet.presenceType = 'PLAYING'
            client.setSettings.run(botSet);
            client.user.setPresence({ activity: { name: botSet.presenceName , type: botSet.presenceType }, status: 'online'})
            return message.channel.send('Reset bots presence master')
        }
        let type = args[0]
        let status = args.slice(1).join(' ');
        if(!status) {
            return message.channel.send(`Please specify a message master`)
        }
        botSet.presenceName = status
        botSet.presenceType = type
        client.setSettings.run(botSet);
        client.user.setPresence({ activity: { name: botSet.presenceName , type: botSet.presenceType }, status: 'online'})
        return message.channel.send('Set the presence master')

    } else {
        message.channel.send('You don\'t have permission to use this command.')
	}
};

exports.help = {
    name: 'presence',
    aliases: [],
    description: 'Set the bots status',
    usage: 'presence {Type} {Status}',
    premium: 'false',
    metrics: 'true',
    category: 'settings'
};