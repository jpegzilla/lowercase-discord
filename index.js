require("dotenv").config();

const discord = require("discord.js");
const { prefix } = require("./config.json");
const handleUserCommands = require("./commands");
const client = new discord.Client();

client.once("ready", () => {
  console.log("ready.");
});

client.on("message", msg => {
  const regex = /[A-HJ-Z]|I(?:[A-Za-z0-9])/gm;
  const emoteRegex = /:(?:[a-zA-Z0-9]+):/gm;
  let member = msg.member.user.username.toLowerCase();
  let originalMessage = msg.content;

  const containsUppercase = string => {
    if (regex.test(string)) return true;
    else return false;
  };

  const isLikelyEmote = string => {
    if (emoteRegex.test(string)) return true;
    else return false;
  };

  const fixMessageCase = (member, originalMessage) => {
    let matches = originalMessage.match(regex);
    let newMsg = "";

    originalMessage.split("").forEach(c => {
      if (matches.indexOf(c) >= 0) newMsg += c.toLowerCase();
      else newMsg += c;
    });

    return {
      said: `**${member} said:** ${newMsg}`,
      content: newMsg
    };
  };

  const beginsWithPrefix = (prefix, string) => {
    if (string.startsWith(prefix)) return true;
    else return false;
  };

  if (beginsWithPrefix(prefix, msg.content) && containsUppercase(msg.content)) {
    // if message is invalid, but user was trying to enter a command

    const fixedMessage = fixMessageCase(member, originalMessage).content;
    const commandWithoutPrefix = fixedMessage.replace(prefix, "").trim();

    if (commandWithoutPrefix) handleUserCommands(commandWithoutPrefix, msg);
  } else if (isLikelyEmote(msg.content)) {
    return;
  } else if (containsUppercase(msg.content)) {
    let newMsg = fixMessageCase(member, originalMessage).said;

    msg.channel.send(`${newMsg}`);
    msg.delete();
  } else if (beginsWithPrefix(prefix, msg.content)) {
    // if user is trying to ask the bot to do somethin
    const commandWithoutPrefix = msg.content.replace(prefix, "").trim();

    if (commandWithoutPrefix) handleUserCommands(commandWithoutPrefix, msg);
  }
});

client.login(process.env.TOKEN); // .listen(process.env.PORT || 5000);

const express = require("express");
const app = express();

let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port", port);
});
