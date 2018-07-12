const Discord = require('discord.js'); 
const axios = require('axios'); 
const querystring = require('querystring') 
const AWS = require('aws-sdk')
const client = new Discord.Client();  
const token = require('./token').token
const grammarCheckAPI = 'http://localhost:8081/v2/check'

AWS.config.update({
  region: 'us-east-2',
  endpoint: 'http://localhost:8000'
})

const dynamodb = new AWS.DynamoDB()

const params = {
  TableName: 'server_settings',
  KeySchema: [
    { AttributeName: "server_id", KeyType: "HASH" },
    { AttributeName: "frequency", KeyType: "RANGE" }
  ], AttributeDefinitions: [
    { AttributeName: "server_id", KeyType: "N" },
    { AttributeName: "frequency", KeyType: "S" },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
}

dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.error('Error JSON', JSON.stringify(err, null, 2))
  } else {
    console.log('Created table. JSON', JSON.stringify(data, null, 2))
  }
})

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
