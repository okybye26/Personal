const axios = require("axios");

module.exports = {
  config: {
    name: "download",
    aliases: ["alldl"],
    version: "0.0.1",
    author: "ArYAN",
    role: 0,
    shortDescription: {
      en: "Retrieves and sends video from a provided URL."
    },
    longDescription: {
      en: "Retrieves video details from the provided URL and sends the video as an attachment."
    },
    category: "VIDEO",
    guide: {
      en: "{pn} <video_url>"
    }
  },

  onStart: async function ({ api, event, args }) {
    if (args.length === 0) {
      return api.sendMessage("❌ Please provide a URL after the command.", event.threadID, event.messageID);
    }

    const videoURL = args.join(" ");
    const apiURL = `https://aryan-alldownloader.onrender.com/alldl?url=${encodeURIComponent(videoURL)}`;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const response = await axios.get(apiURL);
      const { status, data } = response.data;

      if (!status || !data || !data.high) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage("⚠️ No video content available or an error occurred.", event.threadID, event.messageID);
      }

      const { high, title } = data;
      const stream = await global.utils.getStreamFromURL(high, "video.mp4");

      api.sendMessage({
        body: title || "🎥 Video Downloaded",
        attachment: stream
      }, event.threadID, (err) => {
        api.setMessageReaction(err ? "❌" : "✅", event.messageID, () => {}, true);
      });

    } catch (error) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage("❌ An error occurred while retrieving video details.", event.threadID, event.messageID);
    }
  }
};
