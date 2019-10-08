const discord = require("discord.js");
const { prefix, token } = require("./config.json");
const handleUserCommands = require("./commands");
const client = new discord.Client();

client.once("ready", () => {
  console.log("ready.");
});

client.on("message", msg => {
  const regex = /[A-HJ-Z]|I(?:[A-Za-z0-9])/gm;
  let member = msg.member.user.username;
  let originalMessage = msg.content;

  const containsUppercase = string => {
    if (regex.test(string)) return true;
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

    console.log("message caught. running command");

    const fixedMessage = fixMessageCase(member, originalMessage).content;
    const commandWithoutPrefix = fixedMessage.replace(prefix, "").trim();

    console.log("[lowercase] fixed message.", commandWithoutPrefix);

    msg.channel.send(
      `\`[lowercase]\` command recieved ⇒ ${commandWithoutPrefix}`
    );

    if (commandWithoutPrefix) handleUserCommands(commandWithoutPrefix);
  } else if (containsUppercase(msg.content)) {
    let newMsg = fixMessageCase(member, originalMessage).said;

    msg.channel.send(`${newMsg}`);
    msg.delete();
  } else if (beginsWithPrefix(prefix, msg.content)) {
    // if user is trying to ask the bot to do something

    const commandWithoutPrefix = msg.content.replace(prefix, "").trim();

    msg.channel.send(
      `\`[lowercase]\` reporting for duty ⇒ ${commandWithoutPrefix}`
    );

    if (commandWithoutPrefix) handleUserCommands(commandWithoutPrefix);
  }
});

client.login(token);