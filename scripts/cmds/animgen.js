const fs = require("fs");
const path = require("path");
const axios = require("axios");

const data = {};

module.exports = {
  config: {
    name: "animgen",
    author: "UPoL Zox",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "Generate four anime-style images from your prompt",
    longDescription: "Transform your text prompt into four unique anime visuals.",
    category: "image",
    guide: "{pn} <your anime-style prompt> or reply to a message",
  },

  onStart: async function ({ message, args, event, usersData, api }) {
    const uid = event.senderID;
    const name = await usersData.getName(uid);
    const prompt = args.join(" ") || (event.type === "message_reply" ? event.messageReply.body : null);

    if (!prompt) return message.reply("Please provide a prompt or reply to a message to use as the anime theme!");

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
      body: `🎨 Generating anime visuals for ${name}...\n「Prompt」✨ ${prompt}`,
      mentions: [{ id: uid, tag: name }]
    };

    const startTime = Date.now();

    message.reply(tagUser, async (err, info) => {
      try {
        const animApi = `https://upol-test-anim.onrender.com/gen?prompt=${encodeURIComponent(prompt)}`;
        const res = await axios.get(animApi);

        const images = res.data; 
        if (!Array.isArray(images) || images.length !== 4) {
          throw new Error("API did not return exactly 4 images");
        }

        const streams = [];
        const filePaths = [];

        for (let i = 0; i < images.length; i++) {
          const imageUrl = images[i].url;
          const imageRes = await axios.get(imageUrl, { responseType: "arraybuffer" });
          const filePath = path.join(__dirname, "cache", `${Date.now()}_animgen_${i + 1}.png`);
          fs.writeFileSync(filePath, Buffer.from(imageRes.data, "binary"));
          streams.push(fs.createReadStream(filePath));
          filePaths.push(filePath);
        }

        const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
        data[uid].count++;

        await message.reply({
          body: `🌸 Hey ${name}, your anime scenes are ready!\nGenerated in ${timeTaken}s`,
          attachment: streams
        });

        await message.reply({
          body: `🛎️ ${name}`,
          mentions: [{ id: uid, tag: name }]
        });

        filePaths.forEach(filePath => fs.unlinkSync(filePath));

        if (info && info.messageID) {
          api.unsendMessage(info.messageID);
        }

      } catch (err) {
        console.error("Anime Generation Error:", err);
        message.reply("❌ Failed to generate anime images. Please try again later or modify your prompt.");
      }
    });
  }
};
