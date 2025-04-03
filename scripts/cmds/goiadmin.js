module.exports = {
	config: {
		name: "goiadmin",
		author: "BaYjid",
		role: 0,
		shortDescription: "Owner Mention Protection",
		longDescription: "Prevents unnecessary mentions of BaYjid",
		category: "BOT",
		guide: "{pn}"
	},

	onChat: function({ api, event }) {
		// Author Verification
		const authorID = "61574046213712"; // EREN
		if (event.senderID !== authorID) {
			const aid = [authorID];
			for (const id of aid) {
				if (Object.keys(event.mentions).includes(id)) {
					// Styled Box Message
					const msg = [
						"╔════════════════╗\n║  Boss,  একটু ব্যস্ত আছেন! ⏳\n║ 🕶️ **ডাইরেক্ট** আসুন, পরে কথা বলবো! 💬\n╚════════════════╝",
						"╔════════════════╗\n║  EREN এখন বিজি! 📌\n║ 🙄 মেনশন না দিয়ে কথা বলো! \n╚════════════════╝",
						"╔════════════════╗\n║ 💌  মেন্সন না দিয়া পারলে Gf দে 😒\n║ 💢 অই এখনো সিগ্নাল আছে ☹️\n╚════════════════╝",
						"╔════════════════╗\n║ 🚀 Gf না দিলে \n║ মেন্সন দেওয়ার দরকার নাই 😒\n╚════════════════╝"
					];
					return api.sendMessage({ body: msg[Math.floor(Math.random() * msg.length)] }, event.threadID, event.messageID);
				}
			}
		}
	},

	onStart: async function() {
		console.log("✅ goiadmin Module Loaded Successfully!");
	}
};
