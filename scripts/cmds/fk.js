const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const axios = require("axios");

module.exports = {
  config: {
    name: "fk",
    aliases: ["fk", "🐸"],
    version: "1.0",
    author: "aYaan",
    countDown: 5,
    role: 0,
    shortDescription: "Create kiss image with bigger avatars",
    longDescription: "Generate a kiss image with bigger user avatars on a kiss background.",
    category: "funny",
    guide: "{pn} @user"
  },

  onStart: async function ({ api, message, event, args, usersData }) {
    let one, two;
    const mention = Object.keys(event.mentions);

    // Ensure at least two users are mentioned
    if (mention.length === 0) {
      return message.reply("Please mention someone.");
    } else if (mention.length === 1) {
      one = event.senderID;
      two = mention[0];
    } else {
      one = mention[1];
      two = mention[0];
    }

    // Get the avatar URLs for both users
    const avatarURL1 = await usersData.getAvatarUrl(one);
    const avatarURL2 = await usersData.getAvatarUrl(two);

    try {
      // Custom kiss background image URL
      const kissBackgroundURL = "https://i.imgur.com/PXZWktO.jpeg";
      
      // Fetch the images
      const avatar1 = await axios.get(avatarURL1, { responseType: 'arraybuffer' });
      const avatar2 = await axios.get(avatarURL2, { responseType: 'arraybuffer' });
      const kissBackground = await axios.get(kissBackgroundURL, { responseType: 'arraybuffer' });

      // Load images onto canvas
      const canvas = require("canvas");
      const c = canvas.createCanvas(800, 600);  // Increased canvas size for bigger images
      const ctx = c.getContext("2d");

      // Load all images
      const userImg1 = await canvas.loadImage(avatar1.data);
      const userImg2 = await canvas.loadImage(avatar2.data);
      const kissImg = await canvas.loadImage(kissBackground.data);

      // Draw kiss background image
      ctx.drawImage(kissImg, 0, 0, c.width, c.height);

      // Overlay user images (left and right positions with larger size)
      ctx.drawImage(userImg1, 450, 150, 150, 150);  // User 2 (right), bigger size
      ctx.drawImage(userImg2, 100, 150, 150, 150);  // User 1 (left), bigger size

      // Save the combined image
      const pathSave = `${__dirname}/tmp/${one}_${two}_kiss2.png`;
      const output = fs.createWriteStream(pathSave);
      const stream = c.createPNGStream();
      stream.pipe(output);

      output.on("finish", () => {
        // Send the kiss image
        message.reply({
          body: "Here Is Your Fuking Image 🥵!",
          attachment: fs.createReadStream(pathSave),
        }, () => fs.unlinkSync(pathSave));  // Clean up after sending
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ An error occurred while generating the kiss image.");
    }
  }
};
