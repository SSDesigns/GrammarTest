export default class Configure {
  create(message, collection) {
    let words = message.content.split(' ')

    if (words.length != 3) {
      return await `run command $$configure <frequency> <language>.`
    } else {
      await collection.insertOne({
        server_id: message.guild.id,
        frequency: words[1],
        language: words[2]
      })

      return await `server configured with a frequency of ${words[1]} and a language ${words[2]}.`
    }
  }
  
  read() {

  }

  update() {

  }

  delete() {

  }
}