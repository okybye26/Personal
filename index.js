/**
 * Goat Bot Render Deployment Fix by Eren
 */

const express = require("express");
const { spawn } = require("child_process");
const log = require("./logger/log.js");
const pm2 = require("pm2");

// === Express server to keep Render service alive ===
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Goat Bot is alive and running on Render!");
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

// === Start the Goat bot process with PM2 to keep it alive ===
function startProject() {
    // Using PM2 to ensure the process stays alive
    pm2.connect((err) => {
        if (err) {
            console.error("PM2 connection error:", err);
            return;
        }

        pm2.start({
            name: "GoatBot",  // Process name for PM2
            script: "Goat.js", // The bot's main file
            cwd: __dirname,
            exec_mode: "cluster",  // Run in cluster mode for better performance
            instances: 1,  // Number of instances
            autorestart: true,  // Automatically restart on crash
            watch: false,  // Avoid file watching unless needed
            max_memory_restart: "500M"  // Restart the process if it exceeds 500MB of memory
        }, (err, apps) => {
            if (err) {
                console.error("Error starting bot with PM2:", err);
                return;
            }

            console.log("Goat Bot started with PM2.");
        });
    });
}

// Start the bot process with PM2 to keep it alive
startProject();

// === Restart the bot on failure (in case PM2 isn't available) ===
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: ", err);
    log.error("Bot crashed due to an uncaught exception, restarting...");
    startProject();
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("Unhandled Rejection at:", promise, "reason:", reason);
    log.error("Unhandled Rejection: Restarting bot...");
    startProject();
});

// === Render keep-alive mechanism ===
setInterval(() => {
    axios.get("http://localhost:" + PORT)  // Keeps the server running
        .then((response) => {
            console.log("Render keep-alive ping response: ", response.status);
        })
        .catch((err) => {
            console.error("Error during keep-alive ping: ", err);
        });
}, 300000); // 5 minutes interval for the keep-alive ping
