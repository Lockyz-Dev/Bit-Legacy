const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const humanizeDuration = require('humanize-duration');
const sql = new SQLite('./bot.sqlite');

module.exports = {
    name: 'messageCreate',
    execute(message) {
        const client = message.client
        const user = message.author.user
        const member = message.author
        const guild = message.guild
        var logsID = '635300240819486732'

        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        client.setUsSett = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, userAccess, levelNotifications, showNews) VALUES (@userID, @userAccess, @levelNotifications, @showNews);");
        let userset = client.getUsSett.get(message.author.id)

        client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
		client.setGuSett = sql.prepare("INSERT OR REPLACE INTO guildFeatures (guildID, enableLogging, enableWelcome, enableXP, enableRoleOnJoin) VALUES (@guildID, @enableLogging, @enableWelcome, @enableXP, @enableRoleOnJoin);");
        let guildset = client.getGuSett.get(message.guild.id)

		if(!guildset) {
			guildset = { guildID: message.guild.id, enableLogging: 'false', enableWelcome: 'false', enableXP: 'false', enableRoleOnJoin: 'false' }
			client.setGuSett.run(guildset);
		}

        if(!userset) {
            userset = { userID: message.author.id, userAccess: 'false', levelNotifications: 'true', showNews: 'true' };
        }
        client.setUsSett.run(userset);
        
        if(message.author.bot) {
            return;
        }

        if(guildset.enableXP === 'true')
        {
            const cooldowns = new Map();

            client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
            client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (id, user, guild, points, level) VALUES (@id, @user, @guild, @points, @level);");

            let score;
            const cooldown = cooldowns.get(message.author.id);
            if(cooldown) {
                const remaining = humanizeDuration(cooldown - Date.now());
                return;
            }

            cooldowns.set(message.author.id, Date.now() + 7000);
            setTimeout(() => cooldowns.delete(message.author.id, guild.id), 7000);

            score = client.getScore.get(message.author.id, guild.id);

            if (!score) {
                score = { id: `${guild.id}-${message.author.id}`, user: message.author.id, guild: guild.id, points: 1, level: 0};
            }

            //Points given can be anything from 1-10
            const pointsToAdd = Math.floor(Math.random() * 10) + 1;
            score.points += pointsToAdd;

            //Calculate the current level through MATH... Please help
            //0.1 times(the square root of score.points) rounded down to the nearest whole finds the current level.
            const curLevel = Math.floor(0.1 * Math.sqrt(score.points));

            //Check if the user has leveled up, and let them know if they have
            if(score.level < curLevel) {
                //Level up UwU!
                score.level++;
                //Send the TADA EMOTE BOT
                if(userset.levelNotifications === 'true') {
                    const embed = new MessageEmbed()
                    .setTitle('🎉 LEVEL UP 🎉')
                    .setDescription('🎉🎉 Congratulations '+message.author.username+', you\'ve levelled up to **Level '+curLevel+'.** 🎉🎉')
                    .setColor(embedColor)
                    .setTimestamp()
                message.channel.send({ embeds: [embed] });
                }
            }

            client.setScore.run(score);
            return;
        }
    }
}