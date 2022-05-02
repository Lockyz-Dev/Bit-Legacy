const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { embedColor, ownerID } = require('../config');
const SQLite = require("better-sqlite3");
const messageCreate = require('../events/messageCreate');
const sql = new SQLite('./bot.sqlite');
const locale = require('../locale/en-US.json')

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
        const membera = interaction.user
        const usra = interaction.options.getUser('user');
        var user

        if(!usra) {
            user = membera
        } else {
            user = usra
        }

        client.getGuSett = sql.prepare("SELECT * FROM guildFeatures WHERE guildID = ?");
        let guildset = client.getGuSett.get(interaction.guild.id)

        if(!guildset) {
            interaction.reply('The XP System is disabled through guild settings, a server owner should disable this command.')
            return;
        }
        if(guildset.enableXP === "true") {
            interaction.reply('The XP System is disabled through guild settings, a server owner should disable this command.')
            return;
        }

	    client.getScore = sql.prepare("SELECT * FROM scores WHERE user = ? AND guild = ?");

        let score;

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
                .setFooter('Requested by '+interaction.user.username)
                .setColor(embedColor);
            interaction.reply({ embeds: [embed] })
        }
	}
};
