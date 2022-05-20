const { MessageEmbed } = require('discord.js');
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {

        let client = interaction.client;

        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;
    
        try {
            command.execute(interaction);
            client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
            client.setUsSett = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, userAccess, levelNotifications, showNews, language) VALUES (@userID, @userAccess, @levelNotifications, @showNews, @language);");
            let userset = client.getUsSett.get(interaction.user.id)

            if(!userset) {
                userset = { userID: interaction.user.id, userAccess: 'false', levelNotifications: 'true', showNews: 'true' };
            }
            client.setUsSett.run(userset);

            if(userset.showNews === 'true') {
                let inputDate = '2022-05-18T15:00:00'

                let endDate = Math.round(new Date(inputDate ) / 1000);
                let cuurentDate = Math.round(new Date() / 1000)

                if(cuurentDate <= endDate) {
                    interaction.channel.send({ content: 'We\'ve made quite a LOT of changes in this update, check them out in our Discord Server.\nThis will automatically be disabled on <t:'+endDate+'>\nYou can disable news in the user settings command'});
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
	},
};