const { noBotPerms } = require("../utils/errors");
const ms = require("ms");
const SQLite = require("better-sqlite3");
const sql = new SQLite("./bot.sqlite");

exports.run = async (client, message, args) => {

    const guild = message.guild;
    const table2 = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'roleSettings';").get();
	client.getroleSet = sql.prepare("SELECT * FROM roleSettings WHERE guildID = ?");
    client.setroleSet = sql.prepare("INSERT OR REPLACE INTO roleSettings (guildID, adminID, modID, muteID, autoID) VALUES (@guildID, @adminID, @modID, @muteID, @autoID);");
    
	let roleSet;
	
	roleSet = client.getroleSet.get(guild.id);

    if(message.author.id === message.guild.ownerID || message.member.roles.cache.has(roleSet.adminID) || message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("MANAGE_GUILD")) {
        
    let giveawayChannel = message.mentions.channels.first();
    if(!giveawayChannel){
        return message.channel.send(":x: You have to mention a valid channel!")
    }

    let giveawayDuration = args[1];
    if(!giveawayDuration || isNaN(ms(giveawayDuration))){
        return message.channel.send(":x: You have to specify a valid duration!")
    }

    let giveawayNumberWinners = args[2];
    if(isNaN(giveawayNumberWinners)){
        return message.channel.send(":x: You have to specify a valid number of winners!")
    }

    let giveawayPrize = args.slice(3).join(" ");
    if(!giveawayPrize){
        return message.channel.send(":x: You have to specify a valid prize!")
    }

    client.giveawaysManager.start(giveawayChannel, {
        time: ms(giveawayDuration),
        prize: giveawayPrize,
        winnerCount: giveawayNumberWinners,
        messages: {
            giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: "React with 🎁 to participate!",
            winMessage: "Congratulations, {winners}! You won **{prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, no valid participations.",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
                seconds: "seconds",
                minutes: "minutes",
                hours: "hours",
                days: "days",
                pluralS: false // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        }
    });   
    } else {
        message.channel.send(`you don"t have the permission to use this command`)
        return;
    }
};

exports.help = {
    name: "gcreate",
    aliases: [],
    description: "Create a giveaway.",
    usage: "gcreate {Channel Mention} {Duration} {Number of Winners} {Prize}",
    premium: "false",
    metrics: "true",
    category: "giveaway",
    datause: "false"
};