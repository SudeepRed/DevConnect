const DiscordJS  = require('discord.js')
const {Intents} = require('discord.js')
require("dotenv").config();

const client = new DiscordJS.Client({
    intents:[
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})
client.on('ready',()=>{
    console.log('bot is ready')
})

client.on('messageCreate', async(message)=>{
    // console.log(message)
    await message.startThread({
        name: 'bug',
        autoArchiveDuration: 60,
        reason: 'Needed a separate thread for food',
    });
    
})

client.login(process.env.DISCORD_TOKEN);