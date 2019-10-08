const { prefix } = require("./config.json");

module.exports = handleUserCommands = (command, msg) => {
  console.log("[lowercase] handling command:", command);

  const discord = require("discord.js");
  const lowercaseInfo = require("./package.json");
  const configVars = require("./config.json");

  const embed = new discord.RichEmbed().setColor("#e0005d");

  switch (command) {
    // show version / info
    case "v":
    case "i":
    case "version":
    case "info":
      const versionEmbed = new discord.RichEmbed()
        .setColor("#e0005d")
        .setTitle(`[lowercase] ⇒ on github`)
        .setURL(lowercaseInfo.homepage)
        .setAuthor(
          "jpegzilla",
          "https://avatars1.githubusercontent.com/u/19843222?s=460&v=4",
          lowercaseInfo.homepage
        )
        .setDescription(lowercaseInfo.description)
        .setThumbnail(
          "https://github.com/jpegzilla/lowercase-discord/raw/master/assets/lowercase-icon-48.png"
        )
        .addField("version", lowercaseInfo.version, true)
        .addField("prefix", configVars.prefix, true)
        .setTimestamp();

      msg.channel.send(versionEmbed);
      break;

    // help commands
    case "help":
    case "man":
    case "h":
      const helpMessage = embed
        .setTitle(`[lowercase] ⇒ command list`)
        .addField("show version / info", "version, info, v, i", true)
        .addField("show help", "help, man, h", true)
        .addField("show icon", "icon, face, logo", true);

      msg.channel.send(helpMessage);
      break;

    // hello test command
    case "hello":
    case "hi":
    case "hey":
    case "test":
      msg.channel.send("hello!");
      break;

    // show lowercase icon
    case "logo":
    case "icon":
    case "face":
      const logoEmbed = embed
        .setTitle("[lowercase] ⇒ my face")
        .setImage(
          "https://raw.githubusercontent.com/jpegzilla/lowercase-discord/master/assets/lowercase-icon.png"
        );

      msg.channel.send(logoEmbed);
      break;
    default:
      const commandWithoutPrefix = msg.content.replace(prefix, "").trim();

      msg.channel.send(
        `\`[lowercase]\` reporting for duty ⇒ ${commandWithoutPrefix} is not valid. use \`l~ help\` for a list of commands!`
      );
      return;
  }
};
