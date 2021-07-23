const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    let guild = message.guild
    let user = client.user

    message.delete(1000);
    const statsEmbed = new MessageEmbed()
      .setTitle('Server Info')
      .setAuthor(user.username, user.avatarURL())
      .setColor(embedColor)
      .setThumbnail(guild.iconURL())
      if(guild.description != null) {
        statsEmbed.setDescription(guild.description)
      }
      //Basic Guild Information
      statsEmbed.addField(`Name`, guild.name, true)
      statsEmbed.addField(`ID`, guild.id, true)
      statsEmbed.addField(`Owner`, guild.owner, true)
      statsEmbed.addField(`Verification Level`, guild.verificationLevel, true)
      statsEmbed.addField(`Creation Date`, guild.createdAt.toUTCString().substr(0, 16), true)
      statsEmbed.addField(`Is partnered?`, guild.partnered, true)
      statsEmbed.addField(`Is Verified?`, guild.partnered, true)
      statsEmbed.addField(`Rules Channel`, '<#'+guild.rulesChannelID+'>', true)
      //Counts
      statsEmbed.addField(`Boost Tier | Count`, `${guild.premiumTier} | ${guild.premiumSubscriptionCount}`, true)
      statsEmbed.addField(`Total Users | Bots | Humans`, `${guild.memberCount} | ${guild.members.cache.filter(member => member.user.bot).size} | ${guild.members.cache.filter(member => !member.user.bot).size}`, true)
      statsEmbed.addField(`Total Channels`, guild.channels.cache.size, true)
      statsEmbed.addField(`Roles`, guild.roles.cache.size, true)
      statsEmbed.setTimestamp();
      if(guild.bannerURL != null) {
        statsEmbed.setImage(guild.bannerURL())
      }
    message.channel.send(statsEmbed);
};

exports.help = {
    name: 'serverinfo',
    aliases: ['si'],
    description: 'View server information.',
    usage: 'serverinfo',
    premium: 'false',
    metrics: 'true',
    category: 'info'
};