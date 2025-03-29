const axios = require('axios');
const tinyurl = require('tinyurl');

module.exports = {
  config: {
    name: "4k",
    aliases: ["4k", "remini"],
    version: "1.0",
    author: "JARiF",
    countDown: 15,
    role: 0,
    longDescription: "Upscale your image.",
    category: "image",
    guide: {
      en: "{pn} reply to an image"
    }
  },

  onStart: async function ({ message, args, event, api }) {
    const getImageUrl = () => {
      if (event.type === "message_reply") {
        const replyAttachment = event.messageReply.attachments[0];
        if (["photo", "sticker"].includes(replyAttachment?.type)) {
          return replyAttachment.url;
        } else {
          throw new Error("");
        }
      } else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/g) || null) {
        return args[0];
      } else {
        throw new Error("🙂| 𝐑𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞.");
      }
    };

    try {
      const imageUrl = await getImageUrl();
      const shortUrl = await tinyurl.shorten(imageUrl);

      message.reply("⏰ | 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭...");

      const response = await axios.get(`https://www.api.vyturex.com/upscale?imageUrl=${shortUrl}`);
      const resultUrl = response.data.resultUrl;

      message.reply({ body: "✅ | 𝐈𝐦𝐚𝐠𝐞 𝐄𝐧𝐡𝐚𝐧𝐜𝐞𝐝📷.", attachment: await global.utils.getStreamFromURL(resultUrl) });
    } catch (error) {
      message.reply("🥲 | 𝐄𝐫𝐫𝐨𝐫: " + error.message);
      // Log error for debugging: console.error(error);
    }
  }
};
