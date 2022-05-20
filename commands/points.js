const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Get current points.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want information on (Optional)')
                .setRequired(false)
        ),
	async execute(interaction) {
        const client = interaction.client
        var lan = 'en'
        client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
        let guildset = client.getGuSett.get(interaction.guild.id)

        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')
        const membera = interaction.user
        const usra = interaction.options.getUser('user');
        var user;

        if(!usra) {
            user = membera
        } else {
            user = usra
        }

        if(!guildset) {
            interaction.reply('The XP System is disabled through guild settings, a server owner should disable this command.')
            return;
        }

        client.getGuScore = sql.prepare("SELECT * FROM globalScore WHERE userid = ?");
        let guScore = client.getGuScore.get(message.author.id)

        if(!guScore) {
            guScore = { userid: message.author.id, points: 1, level: 0 }
            client.setGuScore.run(guScore)
        }

	    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");
        let score;

        if(guildset.enableXP === "false") {
            interaction.reply({ content: locale.xpDisabled})
            return;
        }

        if(interaction.guild) {
            score = client.getScore.get(user.id, interaction.guild.id);

            if(!score) {
                score = { id: `${interaction.guild.id}-${user.id}`, user: user.id, guild: interaction.guild.id, points: 0, level: 0 };
            }

            var nextLevel = score.level+1;
            //Basically it's score.level +1 divided by 0.1 to the power of 2
            var pointsNeed = Math.floor(Math.pow(((score.level+1)/0.1), 2));
            const embed = new MessageEmbed()
                .setTitle(user.username+"'s Points")
                .addField("Current Level", score.level.toString(), true)
                .addField("Points", score.points.toString(), true)
                .addField("Next Level", nextLevel.toString(), true)
                .addField("Points needed for level "+nextLevel.toString(), pointsNeed.toString()+' points', true)
                .setFooter('Requested by '+interaction.user.username+'')
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] });
        }
	}
};
