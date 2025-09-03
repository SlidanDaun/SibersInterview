module.exports = (db) => {
  const express = require("express");
  const router = express.Router();

  // Get all users
  router.get("/", (req, res) => {
    db.all("SELECT username, first_name, last_name, gender, birthdate FROM users", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  });

  // Get a specific user
  router.get("/:username", (req, res) => {
    db.get("SELECT * FROM users WHERE username = ?", [req.params.username], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: "User not found" });
      res.json(row);
    });
  });

  // Add user
  router.post("/", (req, res) => {
    const { username, password, first_name, last_name, gender, birthdate } = req.body;
    db.run(
      "INSERT INTO users (username, password, first_name, last_name, gender, birthdate) VALUES (?, ?, ?, ?, ?, ?)",
      [username, password, first_name, last_name, gender, birthdate],
      function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ success: true });
      }
    );
  });

  // Change user's data
  router.put("/:username", (req, res) => {
  const { password, first_name, last_name, gender, birthdate, isAdmin } = req.body;

  db.run(
    `UPDATE users 
     SET password = COALESCE(?, password), 
         first_name = COALESCE(?, first_name), 
         last_name = COALESCE(?, last_name), 
         gender = COALESCE(?, gender), 
         birthdate = COALESCE(?, birthdate), 
         isAdmin = COALESCE(?, isAdmin)
     WHERE username = ?`,
    [password, first_name, last_name, gender, birthdate, isAdmin, req.params.username],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "User not found" });
      res.json({ success: true });
    }
  );
});

  // Delete user
  router.delete("/:username", (req, res) => {
    db.run("DELETE FROM users WHERE username = ?", [req.params.username], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "User not found" });
      res.json({ success: true });
    });
  });

  return router;
};