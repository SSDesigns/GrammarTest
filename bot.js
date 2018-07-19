const Discord = require('discord.js')
const axios = require('axios')
const MongoClient = require('mongodb').MongoClient
const querystring = require('querystring')
const discordClient = new Discord.Client()
const { token, url } = require('./secret')
const grammarCheckAPI = 'https://languagetool.org/api/v2/check' 


const options = {
  useNewUrlParser: true
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
      if(message.member.hasPermission('ADMINISTRATOR')) {
        if(guild === null) {
          message.reply(createServer(message, collection))
        } else {
          if(words.length === 3) {
            updateServer(words, guild, collection)
            message.reply(`your server has been updated with the frequency of ${words[1]} and a language of ${words[2]}.`)
          } else if(words[1] === 'help') {
            message.reply(`run command $$configure <frequency> <language>.`)
          } else {
            message.reply(`frequency: ${guild.frequency}, language: ${guild.language}`)
          }
        }
      } else {
        message.reply('you must have administrator privilege to configure this bot')
      }
    // Check if the guild has been configured
    } else if (guild === null) {
      console.log(message.guild.id)
      message.reply(
        `your server has not been configured yet.
        \nrun command $$configure <frequency> <language>.`
      )
    } else {
      if(Math.floor(Math.random() * 100) <= guild.frequency) {
        checkGrammar(message, guild)
      } else {
        console.log('you lucked out')
      }
    }
  })
  
  discordClient.login(token);
})

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
