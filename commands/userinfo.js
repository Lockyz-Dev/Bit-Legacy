const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    //let userID = message.mentions.members.first || args[0] || message.author.id
    if(!args.length) {
      member = message.guild.member(message.author);
      user = message.author

      if(!member) {
        return message.channel.send(`That user doesn't appear to be a member of this server or I cannot find them.`)
      }
      if(!user) {
        return message.channel.send(`I couldn't find that user.`)
      }
    } else if (args[0] = NaN) {
      member = message.guild.member(message.mentions.users.first())
      user = member.user
      
      if(!member) {
        return message.channel.send(`That user doesn't appear to be a member of this server or I cannot find them.`)
      }
      if(!user) {
        return message.channel.send(`I couldn't find that user.`)
      }
    }
     else {
      member = message.guild.member(message.mentions.users.first())
      user = message.guild.member(message.mentions.users.first()).user

      if(!member) {
        return message.channel.send(`That user doesn't appear to be a member of this server or I cannot find them.`)
      }
      if(!user) {
        return message.channel.send(`I couldn't find that user.`)
      }
    }
    const statsEmbed = new MessageEmbed()
      .setTitle('User Info')
      .setAuthor(client.user.username, client.user.avatarURL())
      .setColor(embedColor)
      .setThumbnail(user.avatarURL())
      .addField(`Username`, user.username, true)
      if(member.nickname != null) {
        statsEmbed.addField(`Nickname`, member.nickname, true)
      } else {
        statsEmbed.addField(`Nickname`, 'None', true)
      }
      //.addField(`Nickname`, member.nickname, true)
      statsEmbed.addField(`ID`, user.id, true)
      statsEmbed.addField(`Created`, user.createdAt, true)
      statsEmbed.addField(`Bot?`, user.bot, true)
      statsEmbed.addField(`Presence Status`, user.presence.status)
      statsEmbed.addField(`Joined`, member.joinedAt, true)
      statsEmbed.addField(`Roles`, member.roles.cache.map(r => `${r}`).join(' | '), true)
      statsEmbed.setTimestamp();
    message.channel.send(statsEmbed);
};

exports.help = {
    name: 'userinfo',
    aliases: ['ui'],
    description: 'View User Information.',
    usage: 'userinfo {mention}',
    premium: 'false',
    metrics: 'true',
    category: 'info'
};