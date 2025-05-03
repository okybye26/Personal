 const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "fluxultra",
    aliases: ["flux", "fluxraw", "fluxgen", "fraw", "fluximg"],
    author: "redwan",
    version: "1.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Create a stunning image with the Flux Ultra model based on your prompt.",
    longDescription: "Unleash the power of the Flux Ultra model to generate breathtaking images from your creative prompt.",
    category: "creative",
    guide: "{p}fluxultraraw <your_prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    const obfuscatedAuthor = String.fromCharCode(114, 101, 100, 119, 97, 110);
    if (this.config.author !== obfuscatedAuthor) {
      return api.sendMessage("⚡ Only the creator can modify the author name.", event.threadID, event.messageID);
    }

    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ | A prompt is essential to create something extraordinary. Please provide one.", event.threadID);
    }

    api.sendMessage("🔮 | Your masterpiece is being crafted... Please hold on.", event.threadID, event.messageID);

    try {
      const fluxApiUrl = `https://global-redwans-rest-apis.onrender.com/apifluxltra?prompt=${encodeURIComponent(prompt)}`;
      const response = await axios.get(fluxApiUrl, {
        responseType: "arraybuffer",
      });

      const cacheFolderPath = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }
      const imagePath = path.join(cacheFolderPath, `${Date.now()}_fluxultraraw_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: `🌟 | Here is your stunning creation for: "${prompt}"`,
        attachment: stream,
      }, () => {
        fs.unlinkSync(imagePath);
      });

    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | Something went wrong while generating your vision. Please try again in a moment.");
    }
  }
};
