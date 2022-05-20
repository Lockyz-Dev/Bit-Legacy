const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, InviteGuild } = require('discord.js')
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('usersettings')
		.setDescription('Change User settings')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('privacy_settings')
                .setDescription('Privacy Settings')
                .addStringOption((option) =>
                    option
                        .setName('user_access')
                        .setDescription('Allow other users access to your userinfo?')
                        .addChoice('True', 'true')
                        .addChoice('False', 'false')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('other_settings')
                .setDescription('Just a collection of settings that we couldnt fit into a category.')
                .addStringOption((option) =>
                    option
                        .setName('level_notifications')
                        .setDescription('Notifications on new level within the XP Module.')
                        .addChoice('True', 'true')
                        .addChoice('False', 'false')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('show_news')
                        .setDescription('Show bot news at the bottom of command outputs?')
                        .addChoice('True', 'true')
                        .addChoice('False', 'false')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('language')
                        .setDescription('Change the language you want the bot to use. Some languages haven\'t been added yet')
                        .addChoice('English', 'en')
                        .addChoice('OwOified', 'en-UWU')
                        .setRequired(true)
                )
    ),
	async execute(interaction) {
        const client = interaction.client
        var lan = 'en'
        const usSettTable = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'userSettings';").get();
        client.setUsSett = sql.prepare("INSERT OR REPLACE INTO userSettings (userID, userAccess, levelNotifications, showNews, language) VALUES (@userID, @userAccess, @levelNotifications, @showNews, @language);");
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }

        const locale = require('../locale/'+lan+'.json')

            if(interaction.options.getSubcommand() === 'privacy_settings') {
                const userAccess = interaction.options.getString('user_access')
                var showNuus;
                var showLeevels;
                var userAccuss;
                var userLangoog;

                if(userAccess) {
                    userAccuss = userAccess
                    interaction.reply({ content: 'Your changes have now been applied.', ephemeral: true })
                }

                if(!userset) {
                    showNuus = 'true';
                    showLeevels = 'true';
                    userLangoog = 'en';
                } else {
                    showNuus = userset.showNews;
                    showLeevels = userset.levelNotifications;
                    userLangoog = userset.language;
                }

                userset = { userID: interaction.user.id, userAccess: userAccuss, levelNotifications: showLeevels, showNews: showNuus, language: userLangoog }
                client.setUsSett.run(userset);
            }
            if(interaction.options.getSubcommand() === 'other_settings') {
                const showNews = interaction.options.getString('show_news')
                const levelNotifs = interaction.options.getString('level_notifications')
                const language = interaction.options.getString('language')
                let userset = client.getUsSett.get(interaction.user.id)
                var showNuus;
                var showLeevels;
                var userAccuss;
                var userLangoog;

                const embed = new MessageEmbed()
                    .setTitle('User Settings')
                    .setDescription('If you attempted to change your language feel free to suggest new localisations at https://weblate.lockyzdev.net/ or on our Discord Server https://discord.gg/NgpN3YYbMM')

                if(showNews) {
                    showNuus = showNews;
                    embed.addField('Show News on command outputs', showNuus, true)
                } else {
                    if(!userset) {
                        showNuus = 'false';
                        embed.addField('Show News on command outputs', 'False', true)
                    } else {
                        showNuus = userset.showNews;
                        embed.addField('Show News on command outputs', showNuus, true)
                    }
                }

                if(language) {
                    userLangoog = language
                    embed.addField('Language setting changed', language, true)
                } else {
                    if(!userset) {
                        userLangoog = 'en';
                        embed.addField('Language setting', 'en', true)
                    } else {
                        userLangoog = userset.language;
                        embed.addField('Language setting', language, true)
                    }
                }

                if(levelNotifs) {
                    showLeevels = levelNotifs;
                    embed.addField('Show notifications on Level Up', showLeevels, true)
                } else {
                    if(!userset) {
                        showLeevels = 'false';
                        embed.addField('Show notifications on Level Up', 'False', true)
                    } else {
                        showLeevels = userset.levelNotifications
                        embed.addField('Show notifications on Level Up', showLeevels, true)
                    }
                }
                
                if(!userset) {
                    userAccuss = 'false'
                } else {
                    userAccuss = userset.userAccess;
                }
                embed.addField('Can other users access your basic user information?', userAccuss, true)

                userset = { userID: interaction.user.id, userAccess: userAccuss, levelNotifications: showLeevels, showNews: showNuus, language: userLangoog}
                client.setUsSett.run(userset)
                interaction.reply({ embeds: [embed], ephemeral: true });
            }
    }
};
