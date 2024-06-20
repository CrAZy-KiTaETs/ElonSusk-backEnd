// src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors")
const app = express();
const port = process.env.port || 8080;

// Middleware
app.use(bodyParser.json());
app.use(cors({
   origin: '*'
}))

// Routes
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Функции для работы с БД
const {
    addUserToSheet,
    checkUserInBd,
    findUserByRef,
    updateUserInfo,
  } = require("./functions");


// TELEGRAM BOT
const TelegramBot = require("node-telegram-bot-api");
const token = "802340318:AAFfYcgeSZug9mlTWR18oaFEdNDGjf_YFbY";
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
    username: '',
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
  };

  if (!userInBd) {
    // если юзер перешел по реферальной ссылке
    const referralCode = text.split(" ")[1];
    if (referralCode) {
      let influer
      let invitedUser = await findUserByRef(referralCode);
      invitedUser.balance += 1000;
      invitedUser.ref_count++;
      await updateUserInfo(invitedUser)
      newUser.invited = "true";
      if (referralCode == "q7p9w2o3k1l5z6x8") {
        newUser.inf = "true";
        console.log('инфлюенсер')

      }
      if (invitedUser.inf == "true") {
        newUser.inf_sub = "true";
        newUser.inf_link = invitedUser.id;
        console.log('перешел по ссылке инфлюенсера')
      }
      if (invitedUser.inf_sub == "true") {
        influer = await checkUserInBd(invitedUser.inf_link);
        influer.balance += 500;
        await updateUserInfo(influer)
        console.log(influer, 'перешел по ссылке друга инфлюенсера')

      }
      console.log(invitedUser, newUser, referralCode, "фукнкиця работает");
    }
    addUserToSheet(newUser)
  } else {
    return console.log('пользователь уже был зарегистрирован')
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
      startFn(text, userId, username);
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
