const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const sessions = require("express-session");

const usersRouter = require("../users/users-router.js");
const authRouter = require("../auth/auth-router");
const requiresAuth = require("../auth/requires-auth");
const knexSessionStore = require("connect-session-knex")(sessions); //install librare
const dbConnection = require("../database/connection.js");

const server = express();

const sessionConfig = {
  name: "monster",
  secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
  cookie: {
    maxAge: 1000 * 60 * 10, //10 min in milliseconds
    secure: process.env.COOKIE_SECURE || false, // true means use only oer https
    httpOnly: true, //JS cide on the client cannot access the session cookie
  },
  resave: false,
  saveUnitialized: true, //GDPR compliance, read the docs
  store: new knexSessionStore({
    knex: dbConnection,
    tableName: "sessions",
    sidfieldname: "sid",
    createTable: true,
    clearInterval: 6000, // delet expired sessions every  6 min
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfig)); //turn on sessions

server.use("/api/users", requiresAuth, usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;
