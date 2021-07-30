const { noBotPerms } = require('../utils/errors');

exports.run = async (client, message, args) => {

    let perms = message.guild.me.permissions;
    if (!perms.has('EMBED_LINKS')) return noBotPerms(message, 'EMBED_LINKS');

    message.delete(1000);
    message.channel.send('Press X to doubt.')
    .then(function (message) {
        message.react('699320976034496532')
    })
};

exports.help = {
    name: 'doubt',
    aliases: [],
    description: 'Press X to doubt.',
    usage: 'doubt',
    premium: 'false',
    metrics: 'true',
    category: 'fun',
    datause: 'false'
};