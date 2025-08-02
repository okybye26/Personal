const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "crushimg",
    version: "3.0",
    author: "Amit Max ⚡",
    countDown: 5,
    role: 0,
    shortDescription: "Generate high-quality anime-style images",
    longDescription: "Use hidden Crush mode with style=anime and true boost to generate beautiful anime art.",
    category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
    guide: "{pn} <your anime prompt>"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("❌ Please provide a prompt!\nExample: .crushimg Eren Yeager wearing suit and looking serious");

    if (typeof message.react === "function") {
      await message.react("🌀");
    }

    message.reply("Generating Your Image, Please Wait...🎨");

    try {
      const apiURL = `https://haji-mix-api.gleeze.com/api/crushimg?prompt=${encodeURIComponent(prompt)}&style=anime&negative_prompt=true`;

      const response = await axios.get(apiURL, { responseType: "arraybuffer" });

      const imgPath = path.join(__dirname, "cache", `crushanime_${Date.now()}.jpg`);
      fs.writeFileSync(imgPath, response.data);

      await message.reply({
        attachment: fs.createReadStream(imgPath)
      }, () => fs.unlinkSync(imgPath));
    } catch (err) {
      console.error("❌ Image generation error:", err);
      message.reply("⚠️ Failed to generate. Try again later.");
    }
  }
};
