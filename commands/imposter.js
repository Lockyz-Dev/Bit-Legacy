exports.run = async (client, message, args) => {
    const taggedUser = message.mentions.users.first();

    var user;

    if(!message.mentions.users.size) {
        user = message.author.username
    } else {
        user = taggedUser.username
    }
    
    var randomAnswer = user + ' was ' + (Math.random() * 100 <= 1 ? '' : 'not ') + 'an Imposter.'
    message.channel.send(".      　。　　　　•　    　ﾟ　　。\n　　.　　　.　　　  　　.　　　　　。　　   。　.\n　.　　      。　        ඞ   。　    .    •\n•      "+randomAnswer+"　 　　。　　 　　　　ﾟ　　　.　      　　　.\n,　　　　.　 .")
};

exports.help = {
    name: 'imposter',
    aliases: ['impostor', 'impasta'],
    description: 'Find the Imposters',
    usage: 'imposter',
    premium: 'false',
    metrics: 'true',
    category: 'fun'
};