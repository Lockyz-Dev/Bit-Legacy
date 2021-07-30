const { embedColor } = require('../info.js');
const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    if(!message.member.roles.cache.has("694311887017345036")) {
        message.channel.send(`you don't have the permission to use this command`)
        .then(msg => {
            msg.delete(20000)
        })
        return;
      }
      message.delete(1000);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member)
    return message.channel.send("Please mention a valid member of this server")
    .then(msg => {
        msg.delete(20000)
    })
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    message.channel.send(`${member} has been warned by **${message.author.username}** for \`${reason}\``)
    .then(msg => {
        msg.delete(20000)
    })
    member.send(`You have been warned in ${message.guild} for \`${reason}\``)
    const statsEmbed = new MessageEmbed()
        .setAuthor(`Warn | ${member.user.tag}`, member.user.displayAvatarURL())
        .setColor(embedColor)
        .addField(`Warned By:`, message.author, true)
        .addField(`Reason:`, reason, true)
        .setFooter(`ID: ${member.id}`)
        .setTimestamp();
    client.channels.cache.get(`697496140563742731`).send(statsEmbed);
};

exports.help = {
    name: 'warn',
    aliases: [],
    description: 'Warn User for Reason',
    usage: 'warn {User} {Reason}',
    premium: 'false',
    metrics: 'true',
    category: 'moderation',
    datause: 'false'
};