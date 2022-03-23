const { prefix } = require('./config.json')
const { MessageEmbed } = require('discord.js')
const lowercaseInfo = require('./package.json')

let correction = true

const handleUserCommands = (command, msg) => {
  console.log('[lowercase] handling command:', command)

  const sendInfoMessage = () => {
    const versionEmbed = new MessageEmbed({
      title: '[lowercase] ⇒ on github',
      color: '#e0005d',
      url: lowercaseInfo.homepage,
      author: {
        iconURL: 'https://avatars1.githubusercontent.com/u/19843222?s=460&v=4',
        name: 'jpegzilla',
        url: lowercaseInfo.homepage,
      },
      description: lowercaseInfo.description,
      thumbnail:
        'https://github.com/jpegzilla/lowercase-discord/raw/master/assets/lowercase-icon-48.png',
      timestamp: new Date().toLocaleString(),
      fields: [
        { name: 'version', value: lowercaseInfo.version, inline: true },
        { name: 'prefix', value: prefix, inline: true },
        { name: 'correction on?', value: JSON.stringify(correction) },
      ],
    })

    msg.channel.send({ embeds: [versionEmbed] })
  }

  const sendHelpMessage = () => {
    const helpMessage = new MessageEmbed({
      title: '[lowercase] ⇒ command list',
      color: '#e0005d',
      fields: [
        {
          name: 'show version / info',
          value: 'version, info, v, i',
          inline: true,
        },
        { name: 'show help', value: 'help, man, h', inline: true },
        { name: 'show icon', value: 'icon, face, logo', inline: true },
      ],
    })

    msg.channel.send({ embeds: [helpMessage] })
  }

  const sendLogoMessage = () => {
    const logoEmbed = new MessageEmbed({
      title: '[lowercase] ⇒ my face',
      color: '#e0005d',
      image: {
        url:
          'https://raw.githubusercontent.com/jpegzilla/lowercase-discord/master/assets/lowercase-icon.png',
        height: 1024,
        width: 978,
      },
    })

    msg.channel.send({ embeds: [logoEmbed] })
  }

  const sendInvalidSyntaxWarning = () => {
    const commandWithoutPrefix = msg.content.replace(prefix, '').trim()

    msg.channel.send(
      `\`[lowercase]\` reporting for duty ⇒ ${commandWithoutPrefix} is not valid. use \`l! help\` for a list of commands!`
    )
  }

  switch (command) {
    // show version / info
    case 'v':
    case 'i':
    case 'version':
    case 'info':
      sendInfoMessage()
      break

    // help commands
    case 'help':
    case 'man':
    case 'h':
      sendHelpMessage()
      break

    // hello test command
    case 'hello':
    case 'hi':
    case 'hey':
    case 'test':
      msg.channel.send('hello!')
      break

    // toggle lowercase correction
    case 'correction toggle':
      correction = correction == true ? false : true

      module.exports.correction = correction

      msg.channel.send(
        `\`[lowercase]\` reporting for duty ⇒ correction has been set to ${
          correction ? 'true' : 'false'
        }.`
      )
      break

    // show lowercase icon
    case 'logo':
    case 'icon':
    case 'face':
      sendLogoMessage()
      break
    default:
      sendInvalidSyntaxWarning()
      return
  }
}

module.exports = {
  handleUserCommands: handleUserCommands,
  correction: correction,
}
