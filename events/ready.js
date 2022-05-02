module.exports = {
	name: 'ready',
	once: true,
	execute(client) {

		client.user.setActivity("with your feelings.", {
			type: "PLAYING"
		});

		client.channels.cache.get('708601166191394816').send({ content: '🟢 LMB Slash Command System Online'})
		//client.channels.cache.get('611747163143143443').send({ content: '🟢 LMB Slash Command System Online'})
		client.channels.cache.get('879557759337652294').send({ content: '🟢 LMB Slash Command System Online'})

		client.channels.cache.get('708601166191394816').send({ content: '🟢 LMB Logging System Online'})
		//client.channels.cache.get('611747163143143443').send({ content: '🟢 LMB Logging System V2 Beta Partially Online'})
		client.channels.cache.get('879557759337652294').send({ content: '🟢 LMB Logging System Online'})
		
		client.channels.cache.get('708601166191394816').send({ content: '🟢 LMB XP System Online'})
		//client.channels.cache.get('611747163143143443').send({ content: '🔴 LMB Levelling System V2 Beta Offline'})
		client.channels.cache.get('879557759337652294').send({ content: '🟢 LMB XP System Online'})
		console.log('🟢 LMB XP System Online')

		//client.channels.cache.get('708601166191394816').send({ content: '🔴 LMB Moderation System V2 Beta Offline'})
		//client.channels.cache.get('611747163143143443').send({ content: '🔴 LMB Moderation System V2 Beta Offline'})
		client.channels.cache.get('879557759337652294').send({ content: '🔴 LMB Moderation System Offline'})
		console.log('🔴 LMB Moderation System Offline')

		client.channels.cache.get('708601166191394816').send({ content: '🟢 LMB Giveaway System Online'})
		//client.channels.cache.get('611747163143143443').send({ content: '🟢 LMB Giveaway System Online'})
		client.channels.cache.get('879557759337652294').send({ content: '🟢 LMB Giveaway System Online'})
		console.log('🟢 LMB Giveaway System Online')

		//client.channels.cache.get('708601166191394816').send({ content: '🔴 LMB Suggestions System V2 Beta Offline'})
		//client.channels.cache.get('611747163143143443').send({ content: '🔴 LMB Suggestions System V2 Beta Offline'})
		client.channels.cache.get('879557759337652294').send({ content: '🔴 LMB Suggestions System V2 Beta Offline'})
		console.log('🔴 LMB Suggestions System V2 Beta Offline')

		client.channels.cache.get('708601166191394816').send({ content: '🟢 LMB Settings System Online'})
		//client.channels.cache.get('611747163143143443').send({ content: '🔴 LMB Settings System Offline'})
		client.channels.cache.get('879557759337652294').send({ content: '🟢 LMB Settings System Online'})
		console.log('🟢 LMB Settings System Online')

		client.channels.cache.get('708601166191394816').send({ content: '🟢 LMB Partially Online!'})
		client.channels.cache.get('611747163143143443').send({ content: '🟢 LMB Partially Online!'})
		client.channels.cache.get('879557759337652294').send({ content: '🟢 LMB Partially Online!'})
		console.log('🟢 LMB Partially Online! Logged in as '+ client.user.tag)
		console.log('==== Have a good day! ====');
	},
};