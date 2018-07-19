import ConfigureResource from './configure'

const configureResource = new ConfigureResource()

export default class CommandResource {
  handleCommand(message, collection) {
    let words = message.content.split(' ')

    switch(words[0]) {
      case '$$configure':
        configureResource.handleConfigure(message, collection)
        break
      case '$$rule':
        rule.handleRule(message, collection)
        break
      case '$$member':
        member.handleMember(message, collection)
        break
      default:
        break
    }
  }
}