exports.run = async (client, message, args) => {
    const taggedUser = message.mentions.users.first();

    var user;

    if(!message.mentions.users.size) {
        user = message.author.username
    } else {
        user = taggedUser.username
    }

    const table3 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userSettings';").get();
	client.getuserSet = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
    client.setuserSet = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, metrics, levels, news, levelNotifs, dataCollect) VALUES (@userID, @metrics, @levels, @news, @levelNotifs, @dataCollect);");
    
	let userSet;
	
	userSet = client.getuserSet.get(user.id);

	if(!userSet) {
		userSet = { userID: user.id, metrics: "true", levels: "true", news: "true", levelNotifs: "true", dataCollect: "false" };
		client.setuserSet.run(userSet);
	}

    if(userSet.dataCollect === "false") {
        message.channel.send("Command could not be executed due to data collection being disabled.");
        return;
    }
    
    var randomAnswer = user + " was " + (Math.random() * 100 <= 1 ? "" : "not ") + "an Imposter."
    message.channel.send(".      　。　　　　•　    　ﾟ　　。\n　　.　　　.　　　  　　.　　　　　。　　   。　.\n　.　　      。　        ඞ   。　    .    •\n•      "+randomAnswer+"　 　　。　　 　　　　ﾟ　　　.　      　　　.\n,　　　　.　 .");
};

exports.help = {
    name: "imposter",
    aliases: ["impostor", "impasta"],
    description: "Find the Impostor.",
    usage: "imposter [user]",
    premium: "false",
    metrics: "true",
    category: "fun",
    datause: "false"
};