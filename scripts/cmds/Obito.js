module.exports = {
  config: {
    name: "obito",
    version: "1.0",
    author: "Jadid",
    countDown: 20,
    role: 0,
    shortDescription: "get obito video",
    longDescription: "get random obito video",
    category: "anime",
    guide: "{pn}",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "Loading random obito video... Please wait! 🕐",
    });

    const link = [
      "https://i.imgur.com/xRhHr2Q.mp4",// video credits xenoz (youtube)
      "https://i.imgur.com/LZCKcTv.mp4",
      "https://i.imgur.com/Vo7YhNH.mp4",
      "https://i.imgur.com/XZnb1Xp.mp4",
      "https://i.imgur.com/8xm9oC6.mp4",
      "https://i.imgur.com/sghAhUp.mp4",
      "https://i.imgur.com/UovbhGx.mp4",
      "https://i.imgur.com/FqxjyPi.mp4",
      "https://i.imgur.com/jYZSIm8.mp4",
  "https://i.imgur.com/qfIvuZD.mp4",// Add more video links here
    ];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];

    this.sentVideos.push(randomVideo);

    if (senderID !== null) {
      message.reply({
        body: 'ENJOY..🤍',
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);
    }
  },
};
