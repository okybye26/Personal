const fs = require("fs-extra");
const axios = require("axios");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "rankup",
    version: "1.1",
    author: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 + GoatBot v2 Modified by ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Tự động thông báo level up",
    longDescription: "Thông báo lên cấp kèm hình ảnh",
    category: "user",
    guide: "{pn} để bật/tắt thông báo rankup"
  },

  onStart: async function ({ message, event, threadsData }) {
    const threadID = event.threadID;
    const data = await threadsData.get(threadID);
    const current = data.rankup ?? true;
    await threadsData.set(threadID, { rankup: !current });
    message.reply(`${!current ? "✅ Rankup bật thành công!" : "❌ Rankup đã bị tắt!"}`);
  },

  onChat: async function ({ message, event, usersData, threadsData }) {
    const { threadID, senderID } = event;
    const threadData = await threadsData.get(threadID);
    if (threadData?.rankup === false) return;

    const userData = await usersData.get(senderID);
    let exp = userData.exp || 0;
    const oldLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
    exp += 1;
    const newLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
    await usersData.set(senderID, { exp });

    if (newLevel > oldLevel && newLevel !== 1) {
      const name = userData.name;
      const msg = `💝 🥀══𝐂𝐨𝐍𝐑𝐀𝐓𝐒══🥀\n\n ⃟══•${name}══⃟❣\n\n  𝐘𝐨𝐔𝐑 𝐋𝐄𝐕𝐄𝐋 𝐈𝐒 ➾ 🍫 ${newLevel}\n\n 🥀🥀🥀🥀🥀🥀🥀🥀🥀🥀🥀`;

      const backgrounds = [
        "https://i.postimg.cc/Z5VRbCqN/Picsart-24-07-07-08-59-35-199-1.jpg",
        "https://i.imgur.com/RLpWz6g.jpeg",
        "https://i.imgur.com/MgPRRSY.jpeg"
      ];
      const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

      const pathImg = __dirname + `/cache/rankup_${senderID}.png`;
      const pathAvt = __dirname + `/cache/avt_${senderID}.png`;

      try {
        const avtData = (
          await axios.get(`https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, {
            responseType: "arraybuffer"
          })
        ).data;
        fs.writeFileSync(pathAvt, Buffer.from(avtData, "utf-8"));

        const bgData = (await axios.get(bg, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(pathImg, Buffer.from(bgData, "utf-8"));

        const baseImage = await loadImage(pathImg);
        const avatar = await loadImage(pathAvt);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.rotate(-25 * Math.PI / 180);
        ctx.drawImage(avatar, 37, 120, 125, 130);

        const imageBuffer = canvas.toBuffer();
        fs.writeFileSync(pathImg, imageBuffer);

        await message.reply({
          body: msg,
          attachment: fs.createReadStream(pathImg)
        });

        fs.unlinkSync(pathImg);
        fs.unlinkSync(pathAvt);
      } catch (err) {
        console.error("Error generating rankup image:", err);
        message.reply(msg);
      }
    }
  }
};