module.exports = (path) => {
  const express = require("express");
  const router = express.Router();

  router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
  });

  router.get("/user/:username", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/detail.html"));
  });

  router.get("/add", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/form.html"));
  });

  return router;
};