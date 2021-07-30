const { embedColor } = require('../info.js');
const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    message.delete(1000);
    message.channel.send('Press F to pay respects.')
    .then(function (message) {
        message.react('696788059878064159')
    })
};

exports.help = {
    name: 'respects',
    aliases: [],
    description: 'Press F to pay respects.',
    usage: 'respects',
    premium: 'false',
    metrics: 'true',
    category: 'fun',
    datause: 'false'
};