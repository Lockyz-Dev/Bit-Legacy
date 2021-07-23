const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');
    message.delete(1000);

        if (message.author.id === "100182453812985856") {
            const sayMessage = args.join(" ");
            if(!sayMessage) {
                return message.channel.send("You didn't make me say nothing")}
            message.channel.send(sayMessage)
        } else if(message.author.id === "216977818066616321") {
            const sayMessage = args.join(" ");
            if(!sayMessage) {
                return message.channel.send("You didn't make me say nothing")}
            message.channel.send(sayMessage)
        } else if(!message.member.roles.cache.has("694311884664602735")) {
            message.channel.send(`you don't have the permission to use this command`)
      .then(msg => {
        msg.delete(20000)
    })
            return;
        } else {
            const sayMessage = args.join(" ");
            if(!sayMessage) {
                return message.channel.send("You didn't make me say nothing")}
            message.channel.send(sayMessage)
        }
};

exports.help = {
    name: 'say',
    aliases: [],
    description: 'Make the bot speak',
    usage: 'say {message}',
    premium: 'false',
    metrics: 'true',
    category: 'moderation'
};