const Discord = require('discord.js')
const axios = require('axios')
const MongoClient = require('mongodb').MongoClient
const querystring = require('querystring')
const discordClient = new Discord.Client()
const token = require('./token').token
const grammarCheckAPI = 'http://localhost:8081/v2/check'

const url = 'mongodb://localhost:27017'
const options = {
  useNewUrlParser: true
}

const testGuild = {
  language: 'en-us',
  disabledRules: 'UPPERCASE_SENTENCE_START'
}

let db, collection

MongoClient.connect(url, options, (err, dbClient) => {
  if (err) throw new Error(err)
  db = dbClient.db('servers')
  collection = db.collection('server')

  discordClient.on('ready', () => {
    console.log('I am ready');
  })

  discordClient.on('message', async message => {
    // Make sure message is not from a bot
    if(message.author.bot) return

    let words = message.content.split(' ')

    // Get the message senders guild info
    let guild = await collection.findOne({  server_id: { $eq: message.guild.id }})

    if(words[0] === '$$configure') {
      if(guild === null) {
        createServer(words, guild)
      } else {
        message.reply(configureServer(words, guild))
      }

    // Check if the guild has been configured
    } else if (guild === null) {
      console.log(message.guild.id)
      message.reply(
        `your server has not been configured yet.
        \nrun command $$configure <frequency> <language>`
      )
    } else {
      message.reply(checkGrammer(message, guild))
    }
  })
  
  discordClient.login(token);
})

const updateServer = (words, guild) => {
  if(words.length === 3) {
    switch(words[0]) {
      case '$$configure':
        return `your server has been configured with ${guild.frequency} ${guild.language}`
      default:
        return `the command ${words[0]} is not recognized \nrun the command $$configure to set up this bot`
    }
  } else if(words[1] === 'help') {
    return `run the command $$configure <frequency> <language>`
  } else { 
    return `your current frequency is set to ${guild.frequency} and the language to ${guild.language}`
  }
}

const checkGrammer = (message, guild) => {
  if(Math.random() <= guild.frequency) {
    axios.post(grammarCheckAPI, querystring.stringify({
      'text': message.content,
      'language': guild.language,
      'disabledRules': guild.disabledRules
    }))
    .then(response => {
      if (response.data.matches.length != 0) {
        message.reply(response.data.matches[0].message);
      }
    })
    .catch(error => console.log(error))
  }
}