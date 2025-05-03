const axios = require("axios");

module.exports = {
  config: {
    name: "tinfo",
    version: "0.0.1",
    author: "ArYAN",
    role: 0,
    category: "info",
  },
  onStart: async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const input = args.join(" ");
    if (!input) {
      return api.sendMessage("please provide a valid tiktok username", threadID, messageID);
    }
    try {
      const response = await axios.get(`https://itz.aryan-error-apis.rf.gd/tikstalk?username=${input}`);
      var Url = response.data;
      var nick = Url.nickname;
      var user = Url.username;
      var avtar = Url.avatarLarger;
      var like = Url.heartCount;
      var follower = Url.followerCount;
      var following = Url.followingCount;
      var video = Url.videoCount;
      var rel = Url.relation;
      var heart = Url.heartCount;
      var sec = Url.secUid;
      const aryan = await axios.get(avtar,{responseType: 'stream'});
      var aryany = aryan.data
      var all = `NickName: ${nick}\nUserName: ${user}\nLike: ${like}\nFollower: ${follower}\nFollowing: ${following}\nVideo: ${video}\nRelation: ${rel}\nHeartCount: ${heart}\nSecUid: ${sec} `;
      api.sendMessage({ body: `${all}`, attachment: aryany},threadID,messageID);
    } catch (error) {
      api.sendMessage(`error☞︎︎︎${error.message}`, event.threadID, event.messageID);
    }
  }
};