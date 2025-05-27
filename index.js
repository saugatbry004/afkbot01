const mineflayer = require("mineflayer");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Simple webserver to keep Railway app alive
app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(PORT, () => console.log(`Express server listening on port ${PORT}`));

// Bot config from env or defaults
const SERVER_HOST = process.env.MC_HOST || "afkbottest.aternos.me";
const SERVER_PORT = parseInt(process.env.MC_PORT) || 36350;
const BOT_USERNAME = process.env.MC_USERNAME || "AFK_Bot_01";

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
  });

  bot.on("spawn", () => {
    console.log("[✅] Bot spawned! Anti-AFK running.");

    // Anti-AFK movement every 15 seconds
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      bot.look(yaw, 0, true);
      bot.setControlState("jump", true);
      setTimeout(() => bot.setControlState("jump", false), 500);
    }, 15000);
  });

  // Auto-respawn after death
  bot.on("death", () => {
    console.log("[💀] Bot died! Respawning in 3 seconds...");
    setTimeout(() => bot.emit("respawn"), 3000);
  });

  bot.on("kicked", (reason) => {
    console.log(`[❌] Bot kicked: ${reason}`);
    reconnect();
  });

  bot.on("error", (err) => {
    console.log(`[⚠️] Bot error: ${err}`);
    reconnect();
  });

  bot.on("end", () => {
    console.log("[🔁] Bot disconnected.");
    reconnect();
  });

  bot.on("message", (message) => {
    console.log(`[💬] Chat: ${message.toAnsi()}`);
  });
}

function reconnect() {
  console.log("[⏳] Reconnecting in 1 second...");
  setTimeout(createBot, 1000);
}

createBot();
