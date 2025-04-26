const axios = require("axios");
const fs = require("fs-extra");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "alldl",
    aliases: [],
    version: "1.0.7",
    author: "Dipto // Edited by Eren",
    countDown: 2,
    role: 0,
    description: {
      en: "Download videos from any platform",
    },
    category: "media",
    guide: {
      en: "Use by just pasting the video link.",
    },
    usePrefix: false, // This makes it work without a prefix
  },

  onStart: async function ({ api, args, event }) {
    const link = event.messageReply?.body || args[0];
    if (!link) {
      return api.setMessageReaction("❌", event.messageID, () => {}, true);
    }

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const { data } = await axios.get(`${await baseApiUrl()}/alldl?url=${encodeURIComponent(link)}`);
      const filePath = `${__dirname}/cache/alldl.mp4`;

      if (!fs.existsSync(`${__dirname}/cache`)) fs.mkdirSync(`${__dirname}/cache`);
      const video = (await axios.get(data.result, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(filePath, Buffer.from(video, "utf-8"));

      const shortUrl = await global.utils.shortenURL(data.result);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage({
        body: `━━━━━━━━━━━━━━━━━━━
✨ 𝗬𝗼𝘂𝗿 𝗥𝗲𝗾𝘂𝗲𝘀𝘁𝗲𝗱 𝗩𝗶𝗱𝗲𝗼 𝗶𝘀 𝗛𝗲𝗿𝗲!
────────────────────
🌐 𝗣𝗹𝗮𝘁𝗳𝗼𝗿𝗺 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱: ${data.cp || "Unknown"}

📥 𝗬𝗼𝘂𝗿 𝘃𝗶𝗱𝗲𝗼 𝗵𝗮𝘀 𝗯𝗲𝗲𝗻 𝗳𝗲𝘁𝗰𝗵𝗲𝗱 & 𝗿𝗲𝗮𝗱𝘆 𝘁𝗼 𝗽𝗹𝗮𝘆!

🔗 𝗦𝗵𝗼𝗿𝘁𝗲𝗻𝗲𝗱 𝗟𝗶𝗻𝗸:
${shortUrl || "N/A"}

━━━━━━━━━━━━━━━━━━━
OWNERᯓ 𝐄𝐫𝐞𝐧 𝐘𝐞𝐚𝐠𝐞𝐫 ᯓ
━━━━━━━━━━━━━━━━━━━`,
        attachment: fs.createReadStream(filePath),
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (e) {
      api.setMessageReaction("❎", event.messageID, () => {}, true);
      api.sendMessage(`⚠️ Error: ${e.message}`, event.threadID, event.messageID);
    }
  },

  onChat: async function ({ event, api }) {
    const link = event.message.body || event.messageReply?.body;

    const urlRegex = /https?:\/\/[^\s]+/g;
    const match = link?.match(urlRegex);

    if (match && match[0]) {
      this.onStart({ api, args: [match[0]], event });
    }
  },
};
