const Discord = require('discord.js'); 
const axios = require('axios'); 
const querystring = require('querystring') 
const client = new Discord.Client();  
const token = require('./token').token
const grammarCheckAPI = 'http://localhost:8081/v2/check'
let frequency

client.on('ready', () => {
   console.log('I am ready'); 
})  

client.on('message', message => {
  let words = message.content.split(' ')

  if(words[0] === '$$frequency') {
    let words = message.content.split(' ')
    message.reply(words[1])
  } else {
    if(!message.author.bot) {
      axios.post(grammarCheckAPI, querystring.stringify({
        'text': message.content,
        'language': 'en-US',
        'disabledRules': 'UPPERCASE_SENTENCE_START'
      })).then(response => {
        if(response.data.matches.length != 0 ) {
          message.reply(response.data.matches[0].message);
          console.log(response.data)
        } else {
          console.log('No error');       
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
})  
client.login(token);
