 const os = require("os");
const { createCanvas, loadImage } = require("canvas");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const moment = require("moment-timezone");
const fs = require("fs");

module.exports = {
    config: {
        name: "uptime",
        aliases: ["upt", "up"],
        version: "1.4",
        author: "XOS Ayan",
        role: 0,
        noPrefix: true, // No Prefix Enabled
        shortDescription: {
            en: "Check bot uptime with an image."
        },
        longDescription: {
            en: "Generates an image with uptime while other system stats are sent as text."
        },
        category: "system",
        guide: {
            en: "Just type 'uptime' anywhere to check bot uptime."
        }
    },

    // Required onStart function
    onStart: function () {
        // This can be left empty or you can put any initialization code here
        console.log("Uptime command is now available.");
    },

    // Using onChat event instead of onStart
    onChat: async function ({ event, message, usersData, threadsData }) {
        const body = event.body ? event.body.toLowerCase() : "";
        if (body === "up") {
            try {
                // Calculate uptime
                const uptime = process.uptime();
                const s = Math.floor(uptime % 60);
                const m = Math.floor((uptime / 60) % 60);
                const h = Math.floor((uptime / 3600) % 24);
                const upTimeStr = `${h}h ${m}m ${s}s`;

                // Get system info
                const cpuModel = os.cpus()[0].model;
                const totalMemory = os.totalmem();
                const freeMemory = os.freemem();
                const usedMemory = totalMemory - freeMemory;
                const diskUsage = await getDiskUsage();
                const totalUsers = (await usersData.getAll()).length;
                const totalThreads = (await threadsData.getAll()).length;
                const currentTime = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");

                // Load background image
                const background = await loadImage("https://i.imgur.com/hes9xq4.jpeg");

                // Create canvas (increased size)
                const canvas = createCanvas(1000, 500);  // Increased canvas size (1000x500)
                const ctx = canvas.getContext("2d");

                // Draw background
                ctx.drawImage(background, 0, 0, 1000, 500);  // Updated to match the new canvas size

                // Set text styles & align left
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 50px Arial";
                ctx.textAlign = "left";  // Align text to the left
                ctx.textBaseline = "middle";  // Center text vertically

                // Apply shadow effect for text
                ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;
                ctx.shadowBlur = 5;

                // Move text 1 inch to the left (approximately 72px)
                ctx.fillText("BOT UPTIME", 72, 100);  // Moved 1 inch (72px) to the left
                ctx.fillText(`${upTimeStr}`, 72, 200); // Moved uptime text 1 inch to the left

                // Reset shadow effect for any other drawing
                ctx.shadowColor = "transparent";

                // Save image
                const imagePath = `${__dirname}/uptime_image.png`;
                const buffer = canvas.toBuffer();
                fs.writeFileSync(imagePath, buffer);

                // Send text & image separately
                await message.reply({
                    body: `──────────────────      
            𝗔𝗱𝗺𝗶𝗻 𝗜𝗻𝗳𝗼 :

𝗢𝗪𝗡𝗘𝗥: 𝗥𝗮 𝗔𝗮𝗱
𝗣𝗥𝗘𝗙𝗜𝗫: ( ${global.GoatBot.config.prefix} )

           𝗕𝗼𝗧 𝗥𝘂𝗻 𝗧𝗶𝗺𝗲 :

𝗛𝗼𝘂𝗿𝘀: ${h} 
𝗠𝗶𝗻𝘂𝘁𝗲𝘀: ${m} 
𝗦𝗲𝗰𝗼𝗻𝗱𝘀: ${s}

             - SaYonara     
──────────────────`,
                    attachment: fs.createReadStream(imagePath)
                });

                // Delete image after sending
                fs.unlinkSync(imagePath);
            } catch (err) {
                console.error(err);
                await message.reply("❌ An error occurred while generating the uptime image.");
            }
        }
    }
};

// Function to get disk usage
async function getDiskUsage() {
    const { stdout } = await exec("df -k /");
    const [_, total, used] = stdout.split("\n")[1].split(/\s+/).filter(Boolean);
    return { total: parseInt(total) * 1024, used: parseInt(used) * 1024 };
}

// Function to convert bytes into human-readable format
function prettyBytes(bytes) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
        bytes /= 1024;
        i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
}
