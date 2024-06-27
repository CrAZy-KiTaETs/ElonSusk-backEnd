// src/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = process.env.port || 8080;
const https = require("https");
const http = require("http");
const fs = require("fs");

const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/elonsusk.cloud/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/elonsusk.cloud/fullchain.pem"),
};

// Middleware
app.use((req, res, next) => {
  if (req.secure) {
    return next();
  }
  res.redirect(`https://${req.headers.host}${req.url}`);
});
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

// Routes
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);
const chatsRouter = require("./routes/chats");
app.use("/chats", chatsRouter);

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

http.createServer(app).listen(80, () => {
  console.log("HTTP Server running on port 80");
});

https.createServer(options, app).listen(443, () => {
  console.log("HTTPS Server running on port 443");
});

// Функции для работы с БД
const {
  addUserToSheet,
  checkUserInBd,
  findUserByRef,
  updateUserInfo,
  findChat,
  addChat,
} = require("./functions");

// TELEGRAM BOT
const TelegramBot = require("node-telegram-bot-api");
const token = "6612718115:AAHttDcViXJAsOhBUto3ExMw6s-CicsJBu8";
const bot = new TelegramBot(token, { polling: true });

function getRef() {
  const { v4: uuidv4 } = require("uuid");
  const referralCode = uuidv4();
  return `https://t.me/ElonSusk_bot?start=${referralCode}`;
}

async function startFn(text, userId, username) {
  const userInBd = await checkUserInBd(userId);
  console.log(userInBd, "есть ли пользователь");

  // создаем реферальную ссылку
  const ref = getRef();
  let newUser = {
    id: userId,
    username: username,
    ref: ref,
    wallet: "",
    balance: 0,
    invited: "false",
    is_sub: "false",
    ref_count: 0,
    twitter: "",
    inf: "flase",
    inf_sub: "false",
    inf_link: "",
    broken_platforms: 0,
    last_session: "",
    new_session: "",
    invited_by: 0,
  };

  try {
    if (!userInBd) {
      // если юзер перешел по реферальной ссылке
      const referralCode = text.split(" ")[1];
      if (referralCode) {
        let influer;
        let invitedUser = await findUserByRef(referralCode);
        invitedUser.balance += 1000;
        invitedUser.ref_count++;
        await updateUserInfo(invitedUser);
        newUser.invited = "true";
        newUser.invited_by = invitedUser.id;
        if (referralCode == "q7p9w2o3k1l5z6x8") {
          newUser.inf = "true";
          console.log("инфлюенсер");
        }
        if (invitedUser.inf == "true") {
          newUser.inf_sub = "true";
          newUser.inf_link = invitedUser.id;
          console.log("перешел по ссылке инфлюенсера");
        }
        if (invitedUser.inf_sub == "true") {
          influer = await checkUserInBd(invitedUser.inf_link);
          influer.balance += 500;
          await updateUserInfo(influer);
          console.log(influer, "перешел по ссылке друга инфлюенсера");
        }
        console.log(invitedUser, newUser, referralCode, "фукнкиця работает");
      }
      addUserToSheet(newUser);
      return true;
    } else {
      console.log("пользователь уже был зарегистрирован");
      return false;
    }
  } catch (error) {
    console.log("ошибка при создании пользователя через бота", error);
  }
}

bot.on("message", async (msg) => {
  // текст сообщения
  const text = msg.text;
  // данные пользователя
  const userId = msg.from.id;
  const username = msg.from.username ? msg.from.username : msg.from.first_name;
  // ID чата
  const chatId = msg.chat.id;

  if (/\/start(?:\?.*)?/.test(text)) {
    try {
      // сохранение чата в бд
      const findedChat = await findChat(chatId);
      if (!findedChat) {
        addChat(chatId);
      }
      // добавление пользователя в бд
      let newUser = await startFn(text, userId, username);
      if (newUser) {
        bot.sendMessage(chatId, `Спасибо за регистрацию`);
      } else {
        bot.sendMessage(chatId, `Вы уже были зарегистрированы`);
      }
    } catch (err) {
      bot.sendMessage(chatId, `error... try again`);
    }
  }
  if (text == "lox") {
    try {
      bot.sendMessage(chatId, `HAHAAA`);
    } catch (err) {
      bot.sendMessage(chatId, `error... try again`);
    }
  }
  //   if (text == "/start") {
  //     try {
  //       bot.sendMessage(chatId, `HAHAAA`);

  //     } catch (err) {
  //       bot.sendMessage(chatId, `error... try again`);
  //     }
  //   }
});
