const { MessageEmbed } = require('discord.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('CREATE_INSTANT_INVITE')) return noBotPerms(message, 'CREATE_INSTANT_INVITE');

    if(message.member.hasPermission('CREATE_INSTANT_INVITE') || message.member.hasPermission('ADMINISTRATOR') || message.member.hasPermission('MANAGE_GUILD') || message.member.hasPermission('MANAGE_CHANNELS')) {
        message.channel.createInvite({ maxAge: 0, maxUses: 0, unique: true })
        .then(invite => {
            message.delete()
            message.channel.send('I\'ve sent the invite to you in a DM.')
            message.author.send('You\'re new invite is https://discord.gg/'+invite.code)
        })
        .catch(console.error)
    } else {
        message.channel.send('You don\'t have permission to use this command.')
    }
};

exports.help = {
    name: 'invite',
    aliases: [],
    description: 'Create an invite with specified options.',
    usage: 'invite {use number} {Time}',
    premium: 'false',
    metrics: 'true',
    category: 'info',
    datause: 'false'
};