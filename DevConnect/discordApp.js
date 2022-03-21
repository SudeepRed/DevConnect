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

client.on('messageCreate',(message)=>{
    if(message.content === 'ping') message.reply({
        content: 'pog',
    })
})

client.login(process.env.DISCORD_TOKEN);