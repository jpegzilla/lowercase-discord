require('dotenv').config()

const discord = require('discord.js')
const { prefix } = require('./config.json')

const { handleUserCommands } = require('./commands')

const client = new discord.Client()
const https = require('https')

client.once('ready', () => {
  console.log('ready.')

  setInterval(
    () => https.get('https://lowercase-discord.herokuapp.com/'),
    300000
  )
})

client.on('message', msg => {
  let { correction } = require('./commands')

  const regex = /[A-HJ-Z]|I(?=[A-Za-z0-9])/gm
  const emoteRegex = /:(?:[a-zA-Z0-9]+):/gm
  const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gm
  const urlOnlyRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/gm
  let member = msg.member.user.username.toLowerCase()

  if (member == 'lowercase') return
  let originalMessage = msg.content
  let originalAttachments =
    Array.from(msg.attachments).length > 0
      ? { files: [Array.from(msg.attachments)[0][1].url] }
      : null

  const containsUppercase = string => {
    if (regex.test(string)) return true
    else return false
  }

  const isLikelyUrl = string => {
    if (string.match(urlRegex)) return true
    else return false
  }

  const isLikelyEmote = string => {
    if (emoteRegex.test(string)) return true
    else return false
  }

  const appendData = (member, newMsg) => {
    return {
      said: `**${member} said:** ${newMsg}`,
      content: newMsg
    }
  }

  const fixMessageCase = (member, originalMessage) => {
    // replace inappropriate letters with x's
    let replacedWithX = originalMessage.replace(regex, 'x')
    let matches = originalMessage.match(regex)
    let newMsg = ''
    let index = 0

    // replace x's with lowercase versions of the incorrect uppercase letters
    replacedWithX.split('').forEach(c => {
      if (c == 'x') {
        newMsg += matches[index].toLowerCase()
        ++index
      } else newMsg += c
    })

    return newMsg
  }

  const beginsWithPrefix = (prefix, string) => {
    if (string.startsWith(prefix)) return true
    else return false
  }

  if (
    beginsWithPrefix(prefix, msg.content) &&
    containsUppercase(msg.content) &&
    correction == true
  ) {
    // if message is invalid, but user was trying to enter a command

    const fixedMessage = appendData(
      member,
      fixMessageCase(member, originalMessage)
    ).content
    const commandWithoutPrefix = fixedMessage.replace(prefix, '').trim()

    if (commandWithoutPrefix) handleUserCommands(commandWithoutPrefix, msg)
  } else if (isLikelyEmote(msg.content) || isLikelyUrl(msg.content)) {
    if (urlOnlyRegex.test(msg.content)) {
      // only a url and nothing else
      return
    } else if (
      containsUppercase(msg.content) &&
      urlRegex.test(msg.content) &&
      correction == true
    ) {
      // prevent capital letters from being sent in messages with links, but preserve url case
      const getAllUrls = msg => {
        const matches = []

        const urls = msg.content.match(urlRegex)

        urls.forEach(url => {
          const idx = msg.content.indexOf(url)

          matches.push({
            idx,
            url
          })
        })

        return matches
      }

      const constructFinalMessage = message => {
        const urls = getAllUrls(msg)

        let finalMsg = message

        urls.forEach(({ idx, url }) => {
          finalMsg = [finalMsg.slice(0, idx), url, finalMsg.slice(idx)].join('')
        })
        console.log(finalMsg)
        return finalMsg
      }

      const messageWithoutUrl = msg.content.replace(urlRegex, '')
      const fixedMessage = fixMessageCase(member, messageWithoutUrl)

      const finalMessage = appendData(
        member,
        constructFinalMessage(fixedMessage)
      ).said

      // send message with optional attachments
      msg.channel
        .send(finalMessage, originalAttachments)
        .then(() => msg.delete())
        .catch(e => console.log(e))

      return
    }
  } else if (containsUppercase(msg.content) && correction == true) {
    let newMsg = appendData(member, fixMessageCase(member, originalMessage))
      .said

    // send message with optional attachments
    msg.channel
      .send(`${newMsg}`, originalAttachments)
      .then(() => msg.delete())
      .catch(e => console.log(e))

    return
  } else if (beginsWithPrefix(prefix, msg.content)) {
    // if user is trying to ask the bot to do something
    const commandWithoutPrefix = msg.content.replace(prefix, '').trim()

    if (commandWithoutPrefix) handleUserCommands(commandWithoutPrefix, msg)
  }
})

client.login(process.env.TOKEN) // .listen(process.env.PORT || 5000);

const express = require('express')
const app = express()

let port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('listening on port', port)
})
