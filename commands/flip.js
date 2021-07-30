const { MessageEmbed } = require('discord.js');
const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    message.delete(1000);
    var roll = [
      "Heads",
      "Tails"
  ]
  var randomAnswer = roll[Math.floor(Math.random() * roll.length)];
  const statsEmbed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.avatarURL())
        .setColor(embedColor)
        .setTitle("Coin Flip")
        .setDescription(`You got a ${randomAnswer}`)
        .setTimestamp();
    message.channel.send(statsEmbed);
};

exports.help = {
    name: 'flip',
    aliases: ['coinflip'],
    description: 'Flip a single Coin.',
    usage: 'flip',
    premium: 'false',
    metrics: 'true',
    category: 'fun',
    datause: 'false'
};