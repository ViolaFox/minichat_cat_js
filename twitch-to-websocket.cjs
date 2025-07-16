const WebSocket = require("ws");
const tmi = require("tmi.js");

// Настройка Twitch IRC
const twitchClient = new tmi.Client({
  options: { debug: true },
  connection: { reconnect: true },
  identity: {
    username: "niahkinlife", // Twitch логин
    password: "oauth:bnigqo4nfi32jlrtip6982o0lbz9vd" // Получить здесь: https://twitchapps.com/tmi/
  },
  channels: ["niahkinlife"] // без #
});

// WebSocket сервер для OBS
const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
  console.log("OBS подключён к WebSocket");
});

// Пересылка сообщений в WebSocket
twitchClient.on("message", (channel, tags, message) => {
  const payload = JSON.stringify({
    user: tags["display-name"],
    message: message
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
});

twitchClient.connect();
