 const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const path = require('path');

module.exports = {
	config: {
		name: "pastebin",
		aliases: ["bin"],
		version: "1.0",
		author: "SANDIP // Eren",
		countDown: 5,
		role: 2,
		shortDescription: {
			en: "Upload files to pastebin and sends link"
		},
		longDescription: {
			en: "This command allows you to upload files to pastebin and sends the link to the file."
		},
		category: "Utility",
		guide: {
			en: "Use:\n→ !pastebin <filename>\n→ or pastebin <filename> (only for owner)"
		}
	},

	onStart: async function({ api, event, args }) {
		const fileName = args[0];
		if (!fileName) return api.sendMessage("Please provide a file name.", event.threadID);

		const pastebin = new PastebinAPI({
			api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
			api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
		});

		const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
		const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');

		if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
			return api.sendMessage('❌ File not found!', event.threadID);
		}

		const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

		fs.readFile(filePath, 'utf8', async (err, data) => {
			if (err) {
				console.error(err);
				return api.sendMessage("❌ Error reading the file.", event.threadID);
			}

			const paste = await pastebin
				.createPaste({
					text: data,
					title: fileName,
					format: null,
					privacy: 1,
				})
				.catch((error) => {
					console.error(error);
				});

			if (!paste) return api.sendMessage("❌ Failed to upload to Pastebin.", event.threadID);

			const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");
			api.sendMessage(`✅ File uploaded to Pastebin:\n${rawPaste}`, event.threadID);
		});
	},

	onChat: async function({ event, api }) {
		const body = event.body?.toLowerCase();
		if (!body) return;

		if (!body.startsWith("pastebin ") && !body.startsWith("bin ")) return;

		if (event.senderID !== "61574046213712") {
			return api.sendMessage("⚠️ Only the bot owner can use this command without prefix.", event.threadID);
		}

		const fileName = body.split(" ").slice(1)[0];
		if (!fileName) return api.sendMessage("Please provide a file name.", event.threadID);

		const pastebin = new PastebinAPI({
			api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
			api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
		});

		const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
		const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');

		if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
			return api.sendMessage('❌ File not found!', event.threadID);
		}

		const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;

		fs.readFile(filePath, 'utf8', async (err, data) => {
			if (err) {
				console.error(err);
				return api.sendMessage("❌ Error reading the file.", event.threadID);
			}

			const paste = await pastebin
				.createPaste({
					text: data,
					title: fileName,
					format: null,
					privacy: 1,
				})
				.catch((error) => {
					console.error(error);
				});

			if (!paste) return api.sendMessage("❌ Failed to upload to Pastebin.", event.threadID);

			const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");
			api.sendMessage(`✅ File uploaded to Pastebin:\n${rawPaste}`, event.threadID);
		});
	}
};
