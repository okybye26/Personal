const axios = require('axios');
const { getStreamFromURL, shortenURL } = global.utils;

async function generateImage(prompt) {
  try {
    const taskResponse = await axios.get(
      `https://95zhk3-5000.csb.app/g?prompt=${encodeURIComponent(prompt)}`
    );

    if (!taskResponse.data.taskId) {
      return 'Failed to get task ID from API';
    }

    const taskId = taskResponse.data.taskId;
    const statusResponse = await axios.get(
      `https://95zhk3-5000.csb.app/t?i=${taskId}`
    );
    const result = statusResponse.data;

    return {
      mainImage: result.photoUrl,
      upscaledImages: {
        U1: result.u1Url,
        U2: result.u2Url,
        U3: result.u3Url,
        U4: result.u4Url
      }
    };
  } catch (error) {
    return `Image generation failed: ${error.message}`;
  }
}

async function upscaleImage(imageUrl) {
  try {
    const response = await axios.post(
      'https://95zhk3-5000.csb.app/api/upscaler',
      { imageUrl },
      {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'stream' 
      }
    );
    return response.data;
  } catch (error) {
    return `Upscaling failed: ${error.message}`;
  }
}

module.exports = {
  config: {
    name: 'mid',
    author: 'Nyx',
    category: 'GEN',
    description: 'Generates AI images using MidJourney-style API',
    usage: '<prompt>',
    role: 2
  },

  onStart: async function({ args, message, event }) {
    try {
      const prompt = args.join(' ');
      if (!prompt) return message.reply("👀🎀 » 𝐛𝐛𝐲 𝐩𝐥𝐳 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐩𝐫𝐨𝐦𝐩𝐭");
      const loadingMsg = await message.reply("👀🎀» 𝐁𝐛𝐲 𝐩𝐥𝐳 𝐰𝐚𝐢𝐭, 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐚𝐫𝐭𝐰𝐨𝐫𝐤...");

      const result = await generateImage(prompt);
      if (typeof result === 'string') {
        await message.unsend(loadingMsg.messageID);
        return message.reply(`❌ ${result}`);
      }

      const { mainImage, upscaledImages } = result;
      if (!mainImage) {
        await message.unsend(loadingMsg.messageID);
        return message.reply("❌ Failed to generate image");
      }

      await message.unsend(loadingMsg.messageID);
      message.reply(
        {
          body: "🎨 Generated Artwork\nReply with:\n'U1' - Upscale Variant 1\n'U2' - Upscale Variant 2\n'U3' - Upscale Variant 3\n'U4' - Upscale Variant 4",
          attachment: await getStreamFromURL(mainImage)
        },
        (err, info) => {
          if (err) {
            return message.reply("❌ Error attaching image");
          }

          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            upscaledImages
          });
        }
      );
    } catch (error) {
      message.reply(`❌ Error: ${error.message}`);
    }
  },

  onReply: async function({ message, event, Reply, args }) {
    try {
      const { author, upscaledImages } = Reply;
      if (event.senderID !== author) return;

      const choice = args[0]?.toUpperCase();
      const validChoices = ['U1', 'U2', 'U3', 'U4'];

      if (!validChoices.includes(choice)) {
        return message.reply("❌ Invalid choice. Please reply with U1, U2, U3, or U4");
      }

      const loadingMsg = await message.reply("⏳ Upscaling image, please wait...");
      const selectedUrl = upscaledImages[choice];
      if (!selectedUrl) {
        await message.unsend(loadingMsg.messageID);
        return message.reply("❌ Selected variant not found");
      }

      const stream = await upscaleImage(selectedUrl);
      if (!stream || typeof stream === 'string') {
        await message.unsend(loadingMsg.messageID);
        return message.reply(stream); 
      }

      await message.unsend(loadingMsg.messageID);
      message.reply({
        body: `🖼️ Upscaled ${choice}`,
        attachment: stream
      });
    } catch (error) {
      message.reply(`❌ Error processing your request: ${error.message}`);
    }
  }
};
