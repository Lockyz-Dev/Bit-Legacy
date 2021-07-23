if (Number(process.version.slice(1).split(".")[0]) < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const { Client } = require('discord.js');
const { promisify } = require('util');
const readdir = promisify(require('fs').readdir);
const Enmap = require('enmap');
const config = require('./config.js')
const chalk = require('chalk');
const { GiveawaysManager } = require('discord-giveaways');
require('dotenv-flow').config();
global.fetch = require('node-fetch')

const client = new Client({
	disableEveryone:  true,
	messageCacheMaxSize: 500,
	messageCacheLifetime: 120,
	messageSweepInterval: 60,
	partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 60000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#D900FF",
        reaction: "🎁"
    }
});

client.commands = new Enmap();
client.aliases = new Enmap();
client.categories = new Enmap();
client.categories.fun = new Enmap();
client.categories.moderation = new Enmap();
client.categories.info = new Enmap();
client.categories.level = new Enmap();
client.categories.settings = new Enmap();
client.categories.giveaway = new Enmap();

client.logger = require('./utils/logger');

require('./utils/functions')(client);

const init = async () => {

	const cmdFiles = await readdir('./commands/');
	cmdFiles.forEach(f => {
		if (!f.endsWith('.js')) return;
		const response = client.loadCommand(f);
		if (response) client.logger.log(response);
	});
	console.log(`Loading a total of ${cmdFiles.length} commands.`);

	const evtFiles = await readdir('./events/');
	evtFiles.forEach(f => {
		const evtName = f.split('.')[0];
		console.log(`Loading Event: ${evtName} 👌`);
		const event = require(`./events/${f}`);
		client.on(evtName, event.bind(null, client));
	});
	console.log(`Loading a total of ${evtFiles.length} events.`);
	
	const logFiles = await readdir('./logging/');
	logFiles.forEach(f => {
		const logName = f.split('.')[0];
		console.log(`Loading Log: ${logName}`);
		const log = require(`./logging/${f}`);
		client.on(logName, log.bind(null, client));
	});
	console.log(`Loading a total of ${logFiles.length} Logging Functions.`);

	client.login(`${config.token}`);
};

client.ws.on('INTERACTION_CREATE', async interaction => {
	//8Ball
	if(interaction.data.id === '821343111778664479') {
	  var roll = [
		"Yes",
		"No",
		"Likely",
		"Not Likely",
		"I can't give an answer now"
	  ]
	  var randomAnswer = roll[Math.floor(Math.random() * roll.length)];
	  client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
		  type: 4,
		  data: {
			content: randomAnswer
		  },
		},
	  });
	}
	//CoinFlip
	if(interaction.data.id === '821343553354596373') {
	  var roll1 = [
		"Heads",
		"Tails"
	  ]
	  var randomAnswer = roll1[Math.floor(Math.random() * roll1.length)];
	  client.api.interactions(interaction.id, interaction.token).callback.post({
		data: {
		  type: 4,
		  data: {
			content: randomAnswer
		  },
		},
	  });
	}
  })
  

init();