const fs = require("fs");
const path = require("path");
const axios = require("axios");

const data = {};

module.exports = {
  config: {
    name: "anim",
    author: "UPoL Zox",
    version: "3.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Summon anime scenes with your words",
    longDescription: "Transform your prompts into beautiful anime visuals.",
    category: "image",
    guide: "{pn} <your anime-style prompt> or reply to a message",
  },

  onStart: async function ({ message, args, event, usersData, api }) {
    const uid = event.senderID;
    const name = await usersData.getName(uid);
    const prompt = args.join(" ") || (event.type === "message_reply" ? event.messageReply.body : null);

    if (!prompt) return message.reply(" Please provide a prompt or reply to a message to use as the anime theme!");

    const today = new Date().toDateString();
    if (!data[uid]) data[uid] = { date: today, count: 0 };
    if (data[uid].date !== today) {
      data[uid].date = today;
      data[uid].count = 0;
    }

    if (data[uid].count >= 10) {
      return message.reply(`⚠️ You've reached your daily anime art limit (10). Come back tomorrow to generate more!`);
    }

    const tagUser = {
      body: `🎨 Summoning anime magic for ${name}...\n「Prompt」✨ ${prompt}`,
      mentions: [{ id: uid, tag: name }]
    };

    const startTime = Date.now();

    message.reply(tagUser, async (err, info) => {
      try {
        const animApi = `https://zox-apihub.onrender.com/animgen?prompt=${encodeURIComponent(prompt)}`;
        const res = await axios.get(animApi, { responseType: "arraybuffer" });

        const filePath = path.join(__dirname, "cache", `${Date.now()}_animegen.png`);
        fs.writeFileSync(filePath, Buffer.from(res.data, "binary"));

        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        data[uid].count++;

        const stream = fs.createReadStream(filePath);

        if (info && info.messageID) {
          api.unsendMessage(info.messageID);
        }

        message.reply({
          body: `🌸 Hey ${name}, your anime scene is ready!\n Generated in ${timeTaken}s\n Prompt: ${prompt}`,
          mentions: [{ id: uid, tag: name }],
          attachment: stream
        }, () => {
          fs.unlinkSync(filePath);
        });

      } catch (err) {
        console.error("Anime Generation Error:", err);
        message.reply("❌ Failed to generate anime image. Please try again later or modify your prompt.");
      }
    });
  }
};
