const { embedColor } = require('../info.js');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

exports.run = async (client, message, args) => {

    const guild = message.guild;

    const table0 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'botsettings';").get();
	client.getbotSet = sql.prepare("SELECT * FROM botsettings WHERE botID = ?");
	client.setbotSet = sql.prepare("INSERT OR REPLACE INTO botsettings (botID, prefix, presenceType, presenceName, embedColor, ownerID, isNews, newsTitle, newsText, mainGuild) VALUES (@botID, @prefix, @presenceType, @presenceName, @ownerID, @isNews, @newsTitle, @newsText, @embedColor, @mainGuild);");

    let botSet;

    botSet = client.getbotSet.get("771225733007802369");

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'channelSettings';").get();
	client.getchanSet = sql.prepare("SELECT * FROM channelSettings WHERE guildID = ?");
    client.setchanSet = sql.prepare("INSERT OR REPLACE INTO channelSettings (guildID, logsID, welcomeID, suggestID) VALUES (@guildID, @logsID, @welcomeID, @suggestID);");
    
	let chanSet;
	
	chanSet = client.getchanSet.get(guild.id);

    const table1 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'generalSettings';").get();
	client.getgenSet = sql.prepare("SELECT * FROM generalSettings WHERE guildID = ?");
    client.setgenSet = sql.prepare("INSERT OR REPLACE INTO generalSettings (guildID, prefix, gwayEmote, metrics, level, spam, ticket, invite, leave, news) VALUES (@guildID, @prefix, @gwayEmote, @metrics, @level, @spam, @ticket, @invite, @leave, @news);");
    
	let genSet;
	
	genSet = client.getgenSet.get(guild.id);

    const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
	client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
    client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID, autoID) VALUES (@guildID, @adminID, @modID, @muteID, @autoID);");
    
	let roleSet;
	
	roleSet = client.getroleSet.get(guild.id);

        if(message.author.id === message.guild.ownerID || message.member.roles.cache.has(roleSet.adminID) || message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_GUILD')) {
        
            switch (args[0]) {
                case 'channel':
                    switch (args[1]) {
                        case 'logs':
                            switch (args[2]) {
                                case null:
                                    message.channel.send('You NEED to enter a channel ID or false')
                                return;
                                case 'false':
                                    chanSet.logsID = 'false'
                                    client.setchanSet.run(chanSet);
                                    message.channel.send('Logging Channel has been disabled')
                                return;
                                default:
                                    chanSet.logsID = args[2]
                                    client.setchanSet.run(chanSet);
                                    message.channel.send('Logging Channel has been changed')
                                return;
                            }
                        return;
                        case 'welcome':
                            switch (args[2]) {
                                case null:
                                    message.channel.send('You NEED to enter a channel ID or false')
                                return;
                                case 'false':
                                    chanSet.welcomeID = 'false'
                                    client.setchanSet.run(chanSet);
                                    message.channel.send('Welcome Channel has been disabled')
                                return;
                                default:
                                    chanSet.welcomeID = args[2]
                                    client.setchanSet.run(chanSet);
                                    message.channel.send('Welcome Channel has been changed')       
                                return;
                            }
                        return;
                        case 'suggestions':
                            switch (args[2]) {
                                case null:
                                    message.channel.send('You NEED to enter a channel ID or false')
                                return;
                                case 'false':
                                    chanSet.suggestID = 'false'
                                    client.setchanSet.run(chanSet);
                                    message.channel.send('Suggestions Channel has been disabled')
                                default:
                                    chanSet.suggestID = args[2]
                                    client.setchanSet.run(chanSet);
                                    message.channel.send('Suggestions Channel has been changed')
                            }
                        return;
                        default:
                            message.channel.send('You need to enter a channel Type')
                            return;
                    }
                case 'general':
                    switch (args[1]) {
                        case null:
                            message.channel.send('You NEED to enter a value')
                        return;
                        case 'prefix':
                            switch (args[2]) {
                                case null:
                                    message.channel.send('You NEED to enter a value')
                                return;
                                default:
                                    genSet.prefix = args[2]
                                    client.setgenSet.run(genSet);
                                    message.channel.send('Prefix has been changed')
                                return;
                            }
                        return;
                        case 'gwayEmote':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        case 'metrics':
                            switch (args[2]) {
                                case 'true':
                                    genSet.metrics = 'true'
                                    client.setgenSet.run(genSet);
                                    message.channel.send('Metrics have been enabled')
                                return;
                                case 'false':
                                    genSet.metrics = 'false'
                                    client.setgenSet.run(genSet);
                                    message.channel.send('Metrics have been disabled')
                                return;
                                default:
                                    message.channel.send('Enter either true or false')
                                return;
                            }
                        return;
                        case 'level':
                            switch (args[2]) {
                                case 'true':
                                    genSet.level = 'true'
                                    client.setgenSet.run(genSet);
                                    message.channel.send('Leveling System has been enabled')
                                return;
                                case 'false':
                                    genSet.level = 'false'
                                    client.setgenSet.run(genSet);
                                    message.channel.send('Leveling System has been disabled')
                                return;
                                default:
                                    message.channel.send('Enter either true or false')
                                return;
                            }
                        return;
                        case 'spam':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        case 'ticket':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        case 'invite':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        case 'leave':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        case 'news':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        default:
                            message.channel.send('Please enter a valid value!')
                        return;
                    }
                return;
                case 'role':
                    switch (args[1]) {
                        case null:
                            message.channel.send('You need to enter a role type')
                        case 'admin':
                            switch (args[2]) {
                                case null:
                                    message.channel.send('You NEED to enter a role ID')
                                return;
                                default:
                                    if(message.guild.roles.cache.get(args[2])) {
                                        roleSet.adminID = args[2]
                                        client.setroleSet.run(roleSet);
                                        message.channel.send('Admin Role has been changed')
                                    } else {
                                        message.channel.send('Enter a valid Role ID')
                                    }
                                return;
                            }
                        return;
                        case 'mod':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        case 'mute':
                            message.channel.send('This option hasn\'t been setup yet.')
                        return;
                        case 'auto':
                            switch (args[2]) {
                                case null:
                                    message.channel.send('You NEED to enter a role ID')
                                return;
                                case 'false':
                                    roleSet.autoID = 'false'
                                    client.setroleSet.run(roleSet);
                                    message.channel.send('Auto-join Role has been disabled')
                                default:
                                    if(message.guild.roles.cache.get(args[2])) {
                                        roleSet.autoID = args[2]
                                        client.setroleSet.run(roleSet);
                                        message.channel.send('Auto-join Role has been changed')
                                    } else {
                                        message.channel.send('Enter a valid Role ID')
                                    }
                                return;
                            }
                        return;
                        default:
                            message.channel.send('Please choose a valid role type!')
                        return;
                    }
                return;
                default:
                    const channelEmbed = new MessageEmbed()
                        .setTitle('Channel Settings')
                        .setDescription(`Change Guild Settings\n`+genSet.prefix+'settings channel {option} {Channel ID or false}')
                        .setColor(embedColor)
                    if(chanSet.logsID === 'false') {
                        channelEmbed.addField('logs', 'Disabled', true)
                    } else {
                        channelEmbed.addField('logs', '<#'+chanSet.logsID+'>', true)
                    }
                    if(chanSet.welcomeID === 'false') {
                        channelEmbed.addField('welcome', 'Disabled', true)    
                    } else{
                        channelEmbed.addField('welcome', '<#'+chanSet.welcomeID+'>', true)
                    }
                    if(chanSet.suggestID === 'false') {
                        channelEmbed.addField('suggestions', 'Disabled', true)
                    } else {
                        channelEmbed.addField('suggestions', '<#'+chanSet.suggestID+'>', true)
                    }
                    const generalEmbed = new MessageEmbed()
                        .setTitle('General Settings')
                        .setDescription(genSet.prefix+'settings general {setting} <Additional Options>')
                        .setColor(embedColor)
                    //generalEmbed.addField('General Settings', genSet.prefix+'settings general {setting} <Additional Options>')
                    generalEmbed.addField('prefix', genSet.prefix, true)
                    generalEmbed.addField('gwayEmote', 'Not Finished', true)
                    generalEmbed.addField('metrics', genSet.metrics, true)
                    generalEmbed.addField('level', genSet.level, true)
                    generalEmbed.addField('spam', 'Not Finished', true)
                    generalEmbed.addField('ticket', 'Not Finished', true)
                    generalEmbed.addField('invite', 'Not Finished', true)
                    generalEmbed.addField('leave', 'Not Finished', true)
                    generalEmbed.addField('news', 'Not Finished', true)
                    const roleEmbed = new MessageEmbed()
                        .setTitle('Role Settings')
                        .setDescription(genSet.prefix+'settings role {option} {Role ID or false}')
                        .setColor(embedColor)
                    //roleEmbed.addField('Role Settings', genSet.prefix+'settings role {option} {Role ID or false}')
                    if(roleSet.adminID === "false") {
                        roleEmbed.addField('admin', 'Unset', true)
                    } else {
                        roleEmbed.addField('admin', '<@'+roleSet.adminID+'>', true)
                    }
                    roleEmbed.addField('mod', 'Not Finished', true)
                    roleEmbed.addField('mute', 'Not Finished', true)
                    if(roleSet.autoID === "false") {
                        roleEmbed.addField('auto', 'false', true)
                    } else {
                        roleEmbed.addField('auto', '<@'+roleSet.autoID+'>', true)
                    }
                    const logsEmbed = new MessageEmbed()
                    if(chanSet.logsID === 'false') {
                    } else {
                        logsEmbed.setTitle('Log Settings')
                        logsEmbed.setDescription('Not Finished')
                        logsEmbed.setColor(embedColor)
                        logsEmbed.addField('Log Settings', 'Not Finished')
                        logsEmbed.addField('channel-create', 'Not Finished', true)
                        logsEmbed.addField('channel-delete', 'Not Finished', true)
                        logsEmbed.addField('channel-edit', 'Not Finished', true)
                        logsEmbed.addField('ban-add', 'Not Finished', true)
                        logsEmbed.addField('ban-remove', 'Not Finished', true)
                        logsEmbed.addField('member-join', 'Not Finished', true)
                        logsEmbed.addField('member-leave', 'Not Finished', true)
                        logsEmbed.addField('message-edit', 'Not Finished', true)
                        logsEmbed.addField('message-delete', 'Not Finished', true)
                        logsEmbed.addField('role-create', 'Not Finished', true)
                        logsEmbed.addField('role-delete', 'Not Finished', true)
                        logsEmbed.addField('role-update', 'Not Finished', true)
                    }
                    const infoEmbed = new MessageEmbed()
                        .setTitle('Message Settings')
                        .setDescription('Not Finished')
                        .setColor(embedColor)
                    //infoEmbed.addField('Message Settings', 'Not Finished')
                    infoEmbed.addField('welcome', 'Not Finished', true)
                    infoEmbed.addField('leave', 'Not Finished', true)
                    const userEmbed = new MessageEmbed()
                        .setTitle('User Settings')
                        .setDescription('Not Finished')
                        .setColor(embedColor)
                    //userEmbed.addField('User Settings', 'Not Finished')
                    userEmbed.addField('track-metrics', 'Not Finished', true)
                    userEmbed.addField('news', 'Not Finished', true)
                    userEmbed.addField('level-system', 'Not Finished', true)
                    userEmbed.addField('levelup-notifs', 'Not Finished', true)
                    userEmbed.addField('nodata-collection', 'Not Finished', true)
                    const botEmbed = new MessageEmbed()
                    if(message.author.id === "835394949612175380") {
                        botEmbed.setTitle('Bot Settings')
                        botEmbed.setDescription('Not Finished')
                        botEmbed.setColor(embedColor)
                        //botEmbed.addField('Bot Settings', 'Not Finished')
                        botEmbed.addField('news-enabled', botSet.isNews, true)
                        if(botSet.isNews === 'true') {
                            botEmbed.addField('news-text', botSet.newsText, true)
                            botEmbed.addField('news-title', botSet.newsTitle, true)
                        }
                        botEmbed.addField('presence-text', botSet.presenceName, true)
                        botEmbed.addField('presence-type', botSet.presenceType, true)
                        botEmbed.addField('presence-reset', 'Reset the Discord RPC', true)
                        botEmbed.addField('default-prefix', botSet.prefix, true)
                        botEmbed.addField('embed-colour', 'Not Finished', true)
                        botEmbed.addField('your-id', botSet.ownerID, true)
                        botEmbed.addField('main-guild', botSet.mainGuild, true)
                    }
                    message.channel.send(channelEmbed);
                    message.channel.send(generalEmbed);
                    message.channel.send(roleEmbed);
                    if(chanSet.logsID === 'false') {
                    } else {
                        message.channel.send(logsEmbed);
                    }
                    message.channel.send(infoEmbed);
                    message.channel.send(userEmbed);
                    if(message.author.id === "835394949612175380") {
                        message.channel.send(botEmbed);
                    }
                return;
            }
        } else {
            message.channel.send(`You don't have permission to use this command.`)
        }
};

exports.help = {
    name: 'settings',
    aliases: [],
    description: 'Change guild based settings',
    usage: 'settings {Setting Type} {Setting}',
    premium: 'false',
    metrics: 'false',
    category: 'settings'
};