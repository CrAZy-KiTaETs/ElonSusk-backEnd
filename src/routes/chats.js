// src/routes/users.js
const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/find/:id", async (req, res) => {
    try {
      let chatId = req.params.id;
      const [rows] = await pool.query("SELECT id FROM users_chats WHERE id = ?", [
        chatId,
      ]);
      if (rows.length === 0) {
        return res.json(false);
      }
      console.log("найденный id чата", rows);
      return res.json(rows[0]);
    } catch (error) {
      console.log("Ошибка при поиске чата", error);
    }
  });
  
  // Добавление нового пользователя
  router.post("/add/", async (req, res) => {
    try {
      console.log(req.body, "Это тело запроса");
      let id = req.body;
      await pool.query(
        `INSERT INTO users_chats 
                (id) 
                VALUES (?)`,
        [id]
      );
      res.status(200).send("Чат успешно сохранен");
    } catch (error) {
      console.log("Ошибка при добавлении чата в БД", error);
    }
  });

module.exports = router;
