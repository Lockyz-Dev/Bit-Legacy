const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    if(args[1] === isNaN) {
        message.channel.send('You need to specify a number')
        return;
    }

    if(!args) {
        let args = 6;
    }

    message.delete(1000);
    const statsEmbed = new MessageEmbed()
      .setTitle('Dice Roll')
      .setAuthor(client.user.username, client.user.avatarURL())
      .setColor(embedColor)
      .setDescription(`The Dice Rolled ${Math.round(Math.random() * (args - 1) + 1)}`)
      .setTimestamp();

message.channel.send(statsEmbed);
};

exports.help = {
    name: 'roll',
    aliases: ['diceroll'],
    description: 'Roll a Dice.',
    usage: 'roll [number]',
    premium: 'false',
    metrics: 'true',
    category: 'fun',
    datause: 'false'
};