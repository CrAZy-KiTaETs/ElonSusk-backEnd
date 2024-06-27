// src/routes/users.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Добавление нового пользователя
router.post("/add", async (req, res) => {
  const {
    id,
    username,
    ref,
    wallet,
    balance,
    invited,
    is_sub,
    ref_count,
    twitter,
    inf,
    inf_sub,
    inf_link,
    broken_platforms,
    last_session,
    new_session,
    invited_by,
  } = req.body;
  const data = req.body;
  try {
    await pool.query(
      `INSERT INTO users 
            (id, username, ref, wallet, balance, invited, is_sub, ref_count, twitter, inf, inf_sub, inf_link, broken_platforms, last_session, new_session, invited_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        username,
        ref,
        wallet,
        balance,
        invited,
        is_sub,
        ref_count,
        twitter,
        inf,
        inf_sub,
        inf_link,
        broken_platforms,
        last_session,
        new_session,
        invited_by,
      ]
    );
    res.json({
      id,
      username,
      ref,
      wallet,
      balance,
      invited,
      is_sub,
      ref_count,
      twitter,
      inf,
      inf_sub,
      inf_link,
      broken_platforms,
      last_session,
      new_session,
      invited_by,
    });
    console.log(data, "пользователь добавлен");
  } catch (err) {
    console.error(err.message, "Ошибка при создания пользователя");
    res.status(500).send("Ошибка при создания пользователя");
  }
});

// Обновление данных пользователя
router.put("/update/:id", async (req, res) => {
  const userId = req.params.id;
  const {
    id,
    username,
    ref,
    wallet,
    balance,
    invited,
    is_sub,
    ref_count,
    twitter,
    inf,
    inf_sub,
    inf_link,
    broken_platforms,
    last_session,
    new_session,
    invited_by,
  } = req.body;
  const data = req.body;
  try {
    // // SQL-запрос для обновления данных пользователя
    const [result] = await pool.query(
      `UPDATE users SET
        id = ?, username = ?, ref = ?, wallet = ?, balance = ?, invited = ?,
        is_sub = ?, ref_count = ?, twitter = ?, inf = ?, inf_sub = ?, inf_link = ?, broken_platforms = ?, last_session = ?, new_session = ?, invited_by = ?
       WHERE id = ?`,
      [
        id,
        username,
        ref,
        wallet,
        balance,
        invited,
        is_sub,
        ref_count,
        twitter,
        inf,
        inf_sub,
        inf_link,
        broken_platforms,
        last_session,
        new_session,
        invited_by,
        userId,
      ]
    );

    // // Проверка, был ли пользователь обновлен
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Возвращаем сообщение об успешном обновлении
    console.log(data, "пользователь успешно обновлен");
    res.json({ message: "пользователь успешно обновлен" });
    // res.json(true)
  } catch (err) {
    console.error(err.message, "Ошибка при обновлении пользователя");
    res.status(500).send("Ошибка при обновлении пользователя");
  }
});

// Обновление баланса пользователя
router.put("/updateBalance/", async (req, res) => {
  // const userId = req.params.id;
  const { id, balance } = req.body;
  console.log(id, typeof balance);
  try {
    // // SQL-запрос для обновления данных пользователя
    const [result] = await pool.query(
      `UPDATE users SET
        balance = ? WHERE id = ?`,
      [balance, id]
    );

    // // Проверка, был ли пользователь обновлен
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Возвращаем сообщение об успешном обновлении
    // console.log(data, "пользователь успешно обновлен");
    res.json({ message: "пользователь успешно обновлен" });
    // res.json(true)
  } catch (err) {
    console.error(err.message, "ошибка при обновлении баланса");
    res.status(500).send("Ошибка при обновлении пользователя");
  }
});

// Обновление кошелька пользователя
router.patch("/updateWallet/", async (req, res) => {
  // const userId = req.params.id;
  const { id, wallet } = req.body;
  try {
    // // SQL-запрос для обновления данных пользователя
    const [result] = await pool.query(
      `UPDATE users SET
        wallet = ? WHERE id = ?`,
      [wallet, id]
    );

    // // Проверка, был ли пользователь обновлен
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Возвращаем сообщение об успешном обновлении
    res.json({ message: "кошелек успешно обновлен" });
  } catch (err) {
    console.error(err.message, "ошибка при обновлении баланса");
    res.status(500).send("Ошибка при обновлении пользователя");
  }
});

// Получение всех пользователей
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");

    res.json(rows);
    console.log("получение всех пользователей");
  } catch (err) {
    console.error(err.message, "ошибка при получении всех пользователей");
    res.status(500).send("Ошибка при получении пользователей");
  }
});

router.get("/findById/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);
    if (!rows) {
      return res.json("Пользователь не найден в БД");
    }
    console.log(rows, "поиск по ID", userId);

    if (rows.length === 0) {
      return res.json(false);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message, "ошибка при поиске по АЙДИ");
    res.status(500).send("Ошибка при поиске пользователя по ID");
  }
});

router.get("/findByRef/:ref", async (req, res) => {
  try {
    const userRef = "https://t.me/ElonSusk_bot?start=" + req.params.ref;
    const [rows] = await pool.query("SELECT * FROM users WHERE ref = ?", [
      userRef,
    ]);
    console.log(rows, "найденый юзер по рефералке");

    if (rows.length === 0) {
      return res.json(false);
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message, "ошибка при поиске по рефералке");
    res.status(500).send("Ошибка при поиске пользователя по REF");
  }
});

router.get("/friends/:id", async (req, res) => {
  let userId = req.params.id;
  console.log(userId, "поиск друзей начал работать");

  const [rows] = await pool.query("SELECT * FROM users WHERE invited_by = ?", [
    userId,
  ]);
  
  console.log(rows, "это найденые друзья");
  return res.json(rows);
});

// Тестовое подключение к базе данных
router.get("/test", async (req, res) => {
  try {
    console.log(req, "это тест");
    // const [rows] = await pool.query("SELECT NOW()");
    // res.json({ connected: true, time: rows[0] });
  } catch (err) {
    console.error(err.message, "ошибка при тестовом");
    res.status(500).json({ connected: false, error: err.message });
  }
});

module.exports = router;
