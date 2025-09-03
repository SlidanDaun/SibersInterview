module.exports = (db) => {
  const express = require("express");
  const router = express.Router();

  // Logins form
  router.get("/", (req, res) => {
    res.sendFile(require("path").join(__dirname, "../views/login.html"));
  });

  // Login
  router.post("/", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.send("Введите логин и пароль");
    }

    db.get(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password],
      (err, row) => {
        if (err) return res.status(500).send("Ошибка сервера");
        if (!row || row.isAdmin !== 1) { // check isAdmin
          return res.send("Неверный логин, пароль или вы не админ");
        }

        req.session.user = { username: row.username };
        res.redirect("/");
      }
    );
  });

  // Logout
  router.get("/logout", (req, res) => {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  });

  return router;
};