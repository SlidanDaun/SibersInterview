const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const session = require("express-session");

const app = express();
const PORT = process.env.PORT;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

const db = new sqlite3.Database(path.join(__dirname, "users.db"));



// --- Middleware ---
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const loginRouter = require("./routes/login")(db);
app.use("/login", loginRouter);

function requireAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Routes
const pagesRouter = require("./routes/pages")(path);
const usersRouter = require("./routes/users")(db);


app.use("/", requireAuth, pagesRouter);
app.use("/api/users", requireAuth, usersRouter);

// Launch
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));