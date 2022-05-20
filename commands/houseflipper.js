const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const ms = require("ms");
const SQLite = require("better-sqlite3");
const sql = new SQLite('./bot.sqlite');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('houseflipper')
		.setDescription('Do House Flipper commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName('house')
                .setDescription('Get information on house flipper houses')
                .addStringOption((option) => 
			        option
				        .setName('house')
				        .setDescription('The house you want information for.')
				        .setRequired(true)
		        )
        )
        ,
	async execute(interaction) {
        const client = interaction.client
        const member = interaction.member
        var lan = 'en'
        client.getUsSett = sql.prepare("SELECT * FROM userSettings WHERE userID = ?");
        let userset = client.getUsSett.get(interaction.user.id)

        if(userset) {
            if(userset.language) {
                lan = userset.language;
            }
        }
        const locale = require('../locale/'+lan+'.json')

        if(interaction.options.getSubcommand() === 'house') {
            const hoose = interaction.options.getString('house').toLowerCase();
            var hoob = '61b98ab4988b38f79d3c7956'
            await interaction.deferReply();

            if(hoose.includes('first office')) {
                hoob = '61b98ab4988b38f79d3c7956'
            } else if(hoose.includes('camping bungalow')) {
                hoob = '61b997a33553c387be4264d9'
            }  else if(hoose.includes('burned house')) {
                hoob = '61b997f33553c387be4264dc'
            }  else if(hoose.includes('abandoned house')) {
                hoob = '61b9982e3553c387be4264de'
            }  else if(hoose.includes('almost only a garden')) {
                hoob = '61d269082095521debe3bf4e'
            }  else if(hoose.includes('house after the flood')) {
                hoob = '61d269082095521debe3bf4f'
            }  else if(hoose.includes('foodies house')) {
                hoob = '61d269082095521debe3bf50'
            }  else if(hoose.includes('house with uninvited guests')) {
                hoob = '61d269082095521debe3bf51'
            }  else if(hoose.includes('many generations house')) {
                hoob = '61d269082095521debe3bf52'
            }  else if(hoose.includes('home admin legends')) {
                hoob = '61d269082095521debe3bf53'
            }  else if(hoose.includes('home and car')) {
                hoob = '61d269082095521debe3bf54'
            } else if(hoose.includes('house in a thicket')) {
                hoob = '61d269082095521debe3bf55'
            } else if(hoose.includes('boring house')) {
                hoob = '61d269082095521debe3bf56'
            } else if(hoose.includes('house that is hiding something')) {
                hoob = '61d269082095521debe3bf57'
            } else if(hoose.includes('sellers house')) {
                hoob = '61d269082095521debe3bf58'
            } else if(hoose.includes('hucksters house')) {
                hoob = '61d269082095521debe3bf58'
            } else if(hoose.includes('unsatisfying effect')) {
                hoob = '61d269082095521debe3bf59'
            } else if(hoose.includes('garage with bunker')) {
                hoob = '61d269082095521debe3bf5a'
            } else if(hoose.includes('variable womans house')) {
                hoob = '61d269082095521debe3bf5b'
            } else if(hoose.includes('old house with bunker')) {
                hoob = '61d269082095521debe3bf5c'
            } else if(hoose.includes('pink kingdom')) {
                hoob = '61d269082095521debe3bf5d'
            } else if(hoose.includes('uncles bunker')) {
                hoob = '61d269082095521debe3bf5e'
            } else if(hoose.includes('uninhabited house')) {
                hoob = '61d269082095521debe3bf5f'
            } else if(hoose.includes('man cave')) {
                hoob = '61d269082095521debe3bf60'
            } else if(hoose.includes('garden after building the house')) {
                hoob = '61d269082095521debe3bf61'
            } else if(hoose.includes('family house')) {
                hoob = '61d269082095521debe3bf62'
            } else if(hoose.includes('samarta myers house')) {
                hoob = '61d269082095521debe3bf63'
            } else if(hoose.includes('just married house')) {
                hoob = '61d269082095521debe3bf64'
            } else if(hoose.includes('alone home')) {
                hoob = '61d269082095521debe3bf65'
            } else if(hoose.includes('house on the moon')) {
                hoob = '61d269082095521debe3bf66'
            } else if(hoose.includes('hacker loft')) {
                hoob = '61d269082095521debe3bf67'
            } else if(hoose.includes('accountants house')) {
                hoob = '61d269082095521debe3bf68'
            } else if(hoose.includes('century old house')) {
                hoob = '61d269082095521debe3bf69'
            } else if(hoose.includes('family beach house')) {
                hoob = '61d269082095521debe3bf6a'
            } else if(hoose.includes('house at azure shore')) {
                hoob = '61d269082095521debe3bf6b'
            } else if(hoose.includes('house with sea view')) {
                hoob = '61d269082095521debe3bf6c'
            } else if(hoose.includes('modern house')) {
                hoob = '61d269082095521debe3bf6d'
            } else if(hoose.includes('old ladys house')) {
                hoob = '61d269082095521debe3bf6e'
            } else if(hoose.includes('semi detatched house')) {
                hoob = '61d269082095521debe3bf6f'
            } else if(hoose.includes('stilt house')) {
                hoob = '61d269082095521debe3bf70'
            } else if(hoose.includes('two story semi detached house')) {
                hoob = '61d269082095521debe3bf71'
            } else if(hoose.includes('\'')) {
                return interaction.editReply('Invalid Character `\'`\nWe have excluded characters such as `\'`, `-`, `"`, `,`, etc to improve search results.')
            } else if(hoose.includes('-')) {
                return interaction.editReply('Invalid Character `-`\nWe have excluded characters such as `\'`, `-`, `"`, `,`, etc to improve search results.')
            } else if(hoose.includes('"')) {
                return interaction.editReply('Invalid Character `"`\nWe have excluded characters such as `\'`, `-`, `"`, `,`, etc to improve search results.')
            } else if(hoose.includes(',')) {
                return interaction.editReply('Invalid Character `,`\nWe have excluded characters such as `\'`, `-`, `"`, `,`, etc to improve search results.')
            } else {
                return interaction.editReply({ content: 'I\'m sorry but that query could not be found.\nPlease check the spelling.\n\nPlease note, we\'d LOVE to make this easier to use but unfortunetly due to Discord Limitations we cannot... Sorry'})
            }

            const response = await fetch(`http://172.105.149.87:8000/hf/v1/houses/${hoob}`);
            const data = await response.json();

            if(!data) {
                return interaction.editReply({ content: 'No results found for **'+hoob+'**.'})
            }

            //console.log(data);
            const embed = new MessageEmbed()
                .setAuthor('Housedex')
                .setTitle(data.name)
                .setDescription(data.description)
                .addField('Price', data.price, true)
                .addField('Area', data.area, true)
                .addField('Parcel Area', data.parcel, true)
                .addField('Floors', data.floors, true)
                if(data.dlc[0] === "base") {
                    embed.addField('Platforms', 'This house SHOULD be available on all platforms')
                } else if(data.dlc[0] === "garden") {
                    embed.addField('DLC', 'This house is included in the Garden DLC', true)    
                    embed.addField('Platforms', 'This house SHOULD be available on all platforms')
                } else if(data.dlc[0] === "hgtv") {
                    embed.addField('DLC', 'This house is included in the HGTV DLC', true)
                    embed.addField('Platforms', 'This house SHOULD be available on PC')
                } else if(data.dlc[0] === "luxury") {
                    embed.addField('DLC', 'This house is included in the Luxury Flipper DLC', true)
                    embed.addField('Platforms', 'This house SHOULD be available on PC')
                } else if(data.dlc[0] === "apocalypse") {
                    embed.addField('DLC', 'This house is included in the Apocalypse DLC', true)
                    embed.addField('Platforms', 'This house SHOULD be available on PC')
                } else if(data.dlc[0] === "cyberpunk") {
                    embed.addField('DLC', 'This house is included in the Cyberpunk DLC', true)
                    embed.addField('Platforms', 'This house SHOULD be available on all platforms')
                }
            interaction.editReply({ embeds: [embed] })
        }
    }
};
