const discord = require("discord.js");
const { prefix, token } = require("./config.json");
const client = new discord.Client();

client.once("ready", () => {
  console.log("ready.");
});

const fixMessageCase = (member, originalMessage) => {
  let matches = originalMessage.match(regex);
  let newMsg = "";

  originalMessage.split("").forEach(c => {
    if (matches.indexOf(c) >= 0) newMsg += c.toLowerCase();
    else newMsg += c;
  });

  return `${member} said: ${newMsg}`;
};

client.on("message", msg => {
  const regex = /[A-HJ-Z]|I(?:[A-Za-z0-9])/gm;
  let member = msg.member.user.username;
  let originalMessage = msg.content;

  const containsUppercase = string => {
    if (regex.test(string)) return true;
    else return false;
  };

  const beginsWithPrefix = (prefix, string) => {
    if (string.startsWith(prefix)) return true;
    else return false;
  };

  if (containsUppercase(msg.content)) {
    let newMsg = fixMessageCase(member, originalMessage).toString();

    msg.channel.send(`${newMsg}`);
    msg.delete();
  } else if (
    beginsWithPrefix(prefix, msg.content) &&
    containsUppercase(msg.content)
  ) {
    // if message is invalid, but user was trying to enter a command

    console.log("message caught. running command");

    const newMessage = fixMessageCase(member, originalMessage).toString();

    console.log("[lowercase] fixed message.", newMessage);
  } else if (beginsWithPrefix(prefix, msg.content)) {
    // if user is trying to ask the bot to do something

    msg.channel.send("reporting for duty.");
  }
});

client.login(token);
