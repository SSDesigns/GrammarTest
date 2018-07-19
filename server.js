import Discord from 'discord.js'
import axios from 'axios'
import querystring from 'querystring'
import dotenv from 'dotenv'
import CommandResource from './src/resource/command'
import Configure from './src/service/configure'

dotenv.config()

const MongoClient = require('../../Library/Caches/typescript/2.9/node_modules/@types/mongodb').MongoClient
const discordClient = new Discord.Client()
const grammarCheckAPI = 'https://languagetool.org/api/v2/check'
const commandResource = new CommandResource()
const configure = new Configure()

const options = {
  useNewUrlParser: true
}

const commands = ['$$configure', '$$rule', '$$member']

let db, collection

MongoClient.connect(process.env.DB_HOST, options, (err, dbClient) => {
  if (err) throw new Error(err)
  db = dbClient.db('servers')
  collection = db.collection('server')

  discordClient.on('ready', () => {
    console.log('I am ready');
  })

  discordClient.on('message', async message => {
    // Make sure message is not from a bot
    if(message.author.bot) return

    // Get the message senders guild info
    let guild = await collection.findOne({  server_id: { $eq: message.guild.id }})

    commandResource.create

    // Configure the server
    // Check if the guild has been configured
    if (words[0] === '$$configure') {
      if (message.member.hasPermission('ADMINISTRATOR')) {
        if (guild === null) {
          message.reply(configure.create(message, collection))
        } else {
          if (words.length === 3) {
            updateServer(words, guild, collection)
            message.reply(`your server has been updated with the frequency of ${words[1]} and a language of ${words[2]}.`)
          } else if (words[1] === 'help') {
            message.reply(`run command $$configure <frequency> <language>.`)
          } else {
            message.reply(`frequency: ${guild.frequency}, language: ${guild.language}`)
          }
        }
      } else {
        message.reply('you must have administrator privilege to configure this bot')
      }
    } else if (guild === null) {
      console.log(message.guild.id)
      message.reply(
        `your server has not been configured yet.
        \nrun command $$configure <frequency> <language>.`
      )
    } else if(commands.includes(words[0])) {
      CommandResource.handleCommand(message, collection)
    } else {
      if(Math.floor(Math.random() * 100) <= guild.frequency) {
        checkGrammar(message, guild)
      } else {
        console.log('you lucked out')
      }
    }
  })
  
  discordClient.login(process.env.BOT_TOKEN);
})

const handleConfigure = (message, collection) => {
  let words = message.content.split(' ')

  // Have to be an administrator to configure the server
  if (message.member.hasPermission('ADMINISTRATOR')) {
    if (guild === null) {
      message.reply(createServer(message, collection))
    } else {
      if (words.length === 3) {
        updateServer(words, guild, collection)
        message.reply(`your server has been updated with the frequency of ${words[1]} and a language of ${words[2]}.`)
      } else if (words[1] === 'help') {
        message.reply(`run command $$configure <frequency> <language>.`)
      } else {
        message.reply(`frequency: ${guild.frequency}, language: ${guild.language}`)
      }
    }
  } else {
    message.reply('you must have administrator privilege to configure this bot')
  }
}

const createServer = async (message, collection) => {
  let words = message.content.split(' ')
  
  if(words.length != 3) {
    return await `run command $$configure <frequency> <language>.`
  } else {
    await collection.insertOne({server_id: message.guild.id, frequency: words[1], language: words[2]})

    return await `server configured with a frequency of ${words[1]} and a language ${words[2]}.`
  }
}

const updateServer = (words, guild, collection) => { 
  collection.update(
    {
      server_id: guild.server_id
    }, {
      server_id: guild.server_id, 
      frequency: words[1], 
      language: words[2]
    }
  )
}

const checkGrammar = (message, guild) => {
  let apiResponse, count = 1

  axios.post(grammarCheckAPI, querystring.stringify({
    'text': message.content,
    'language': guild.language,
    'disabledRules': guild.disabledRules
  }))
  .then(async response => {
    if (response.data.matches.length != 0) {
       apiResponse = await response.data.matches.map(match => {
         return `${count++}. ${match.message}.\n`
       })

       await message.reply(apiResponse)
    }
  })
  .catch(error => console.log(error))
}
