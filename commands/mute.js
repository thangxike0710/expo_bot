const Discord = require("discord.js");
const ms = require("ms");
const send = require('quick.hook'); //WebHooks lib
var fs = require('fs'); //FileSystem
let conf = JSON.parse(fs.readFileSync("./config.json", "utf8")); //Config file

module.exports.run = async (client, message, args) => {
  
  let log = client.channels.get('471603875749691393') // Logging channel

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "You don't have permissions, baby",
      "color": 0xff2222
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return message.channel.send({
    embed: {
      "title": "Couldn't find user :anguished: ",
      "color": 0xff2222
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
  if (tomute.hasPermission("MANAGE_MESSAGES")) return message.channel.send({
    embed: {
      "title": "The user you are trying to mute is either the same, or higher role than you",
      "color": 0xff2222
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
  let muterole = message.guild.roles.find(`name`, "With Dick In Mouth");

  if (!muterole) {
    try {
      muterole = await message.guild.createRole({
        name: "With Dick In Mouth",
        color: "#000000",
        permissions: []
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false
        });
      });
    } catch (e) {
      console.log(e.stack);
    }
  }

  let mutetime = args[1];
  if (!mutetime) return message.channel.send({
    embed: {
      "title": "You didn't specify a time!",
      "color": 0xff2222
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });

  await (tomute.addRole(muterole.id));
  message.channel.send({
    embed: {
      "title": "Muted",
      "description": `<@${tomute.id}> has been muted for ${ms(ms(mutetime))} seconds by <@${message.author.id}>`,
      "color": 0xf47742
    }
  }).then(msg => {
    if (conf[message.guild.id].delete == 'true') {
      msg.delete(conf[message.guild.id].deleteTime);
    }
  });
  
  var muteLog = new Discord.RichEmbed()
    .setColor(0xf4d742)
    .setDescription(`<@${tomute.id}>` + " was muted by " + message.author.tag + "\nMuted for " + mutetime)
    .setTitle("User muted in " + message.guild.name);
  
  send(log, muteLog, {"name": "Mute Log", "icon": "https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2F862.png?1532600798485"});

  setTimeout(function() {
    
    if (!tomute.roles.has(muterole.id)) return;
    
    tomute.removeRole(muterole.id);
    
    var unmuteLog = new Discord.RichEmbed()
      .setColor(0xf4d742)
      .setDescription(`<@${tomute.id}>` + " was muted for " + mutetime)
      .setTitle("User unmuted in " + message.guild.name);
    
    send(log, unmuteLog, {"name": "Mute Log", "icon": "https://cdn.glitch.com/88b80c67-e815-4e13-b6a0-9376c59ea396%2F862.png?1532600798485"});
    message.channel.send({
      embed: {
        "description": `<@${tomute.id}> has been unmuted!`,
        "color": 0x22ff22,
        "title": "Unmuted"
      }
    }).then(msg => {
      if (conf[message.guild.id].delete == 'true') {
        msg.delete(conf[message.guild.id].deleteTime);
      }
    });
  }, ms(mutetime));

}