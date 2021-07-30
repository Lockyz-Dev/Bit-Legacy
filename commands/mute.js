const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    if(!message.member.roles.cache.has("516553151936069659")) {
        message.channel.send(`you don't have the permission to use this command`)
        .then(msg => {
            msg.delete(20000)
        })
        return;
      }
  
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if(!member)

    return message.channel.send("Please mention a valid member of this server")
    .then(msg => {
        msg.delete(20000)
    })

    let reason = args.slice(1).join(' ');

    if(!reason) reason = "No reason provided";

    let muted = message.guild.roles.cache.get("631189673905225728")
        member.roles.add(muted).catch(error => message.channel.send(`Sorry, I couldn't mute because of: ${error}`)
        .then(msg => {
            msg.delete(20000)
        }));

    message.delete(1000);
    message.channel.send(`${member} has been kicked by **${message.author.username}** for \`${reason}\``)
    .then(msg => {
        msg.delete(20000)
    })
    const statsEmbed = new MessageEmbed()
        .setAuthor(`Mute | ${member.user.tag}`, member.user.displayAvatarURL())
        .setColor(embedColor)
        .addField(`Muted By:`, message.author, true)
        .addField(`Reason:`, reason, true)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp();
    client.channels.cache.get(`718004574090428470`).send(statsEmbed);
};

exports.help = {
    name: 'mute',
    aliases: [],
    description: 'Mute a User.',
    usage: 'mute <username>',
    premium: 'false',
    metrics: 'true',
    category: 'moderation',
    datause: 'false'
};