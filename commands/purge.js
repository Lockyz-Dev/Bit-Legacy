const { embedColor } = require('../info.js');
const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('MANAGE_MESSAGES')) return noBotPerms(message, 'MANAGE_MESSAGES');

    const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
    client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
      client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID, autoID) VALUES (@guildID, @adminID, @modID, @muteID, @autoID);");
      
    let roleSet;
    
    roleSet = client.getroleSet.get(guild.id);
    
    if(!message.member.roles.cache.has("694311887017345036")) {
      message.channel.send(`you don't have the permission to use this command`)
      .then(msg => {
        msg.delete(20000)
    })
      return;
    }
    const deleteCount = parseInt(args[0], 10);
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.channel.send("Please provide a number between 2 and 100 for the number of messages to delete");
    const fetched = await message.channel.messages.fetch({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.channel.send(`Couldn't delete messages because of: ${error}`));

    const statsEmbed = new MessageEmbed()
      .setAuthor(`Purge | ${message.author.username}`, message.author.username.displayAvatarURL())
      .setColor(embedColor)
      .addField(`Channel:`, `<#${message.channel.id}>`, true)
      .addField(`Amount:`, deleteCount, true)
      .setTimestamp();
    client.channels.cache.get(`697496140563742731`).send(statsEmbed);
};

exports.help = {
    name: 'purge',
    aliases: ['clean'],
    description: 'Remove a specific amount of messages from a channel',
    usage: 'purge {amount}',
    premium: 'false',
    metrics: 'true',
    category: 'moderation'
};