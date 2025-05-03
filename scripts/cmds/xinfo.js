const axios = require("axios");
const moment = require("moment-timezone");
const stream = require("stream");

module.exports = {
  config: {
    name: "info",
    aliases: ["botinfo", "i"],
    version: "1.0",
    author: "Eren x Sheishiro Nagi",
    countDown: 5,
    role: 0,
    shortDescription: "Show bot info with video",
    longDescription: "Sends a video containing bot time, uptime, and admin details",
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ message }) {
    const uptimeSec = process.uptime();
    const h = Math.floor(uptimeSec / 3600);
    const m = Math.floor((uptimeSec % 3600) / 60);
    const s = Math.floor(uptimeSec % 60);
    const uptime = `${h}h ${m}m ${s}s`;

    const currentTime = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

    const body = `
╔══『 𝗕𝗢𝗧 』══╗
┏━━━━━━━━━━━━━━━━┓
┃ 🧑 Admin Info
┃ ╰➤ Name: Raad
┃ ╰➤ Facebook: Ra Aad
┃ ╰➤ Instagram: raadx102
┃ ╰➤ Status: Single
┃
┃ 🤖 Bot Details
┃ ╰➤ Name: 🕸️ Spidey 🕷️
┃ ╰➤ Time: ${currentTime}
┃ ╰➤ Uptime: ${uptime}
┗━━━━━━━━━━━━━━━━┛

I may not be perfect,
   but I’ll always reply to you.
    `;

    try {
      const res = await axios({
        method: "GET",
        url: "https://files.catbox.moe/d5ktl4.mp4",
        responseType: "stream"
      });

      const passThrough = new stream.PassThrough();
      res.data.pipe(passThrough);

      await message.reply({
        body,
        attachment: passThrough
      });

    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to load video from URL.");
    }
  }
};
