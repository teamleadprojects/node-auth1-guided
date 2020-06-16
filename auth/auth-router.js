const router = require("express").Router();
const bcryptjs = require("bcryptjs");

const Users = require("../users/users-model");

// router.get("/", (req, res) => {
//   Users.find()
//     .then((users) => {
//       res.status(200).json(users);
//     })
//     .catch((err) => res.send(err));
// });
router.post("/register", (req, res) => {
  //validate the body,, to make sure there is a username and password
  let { username, password } = req.body;
  //hash user password
  const rounds = process.env.HASH_ROUNDS || 8; // change to a higher number in production
  const hash = bcryptjs.hashSync(password, rounds);
  Users.add({ username, password: hash })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => res.send(err));
});

router.post("/login", (req, res) => {
  //validate the body, to make sure there is a username and passord
  const { username, password } = req.body;

  //verify user password
  Users.findBy({ username })
    .then(([user]) => {
      console.log(user);
      if (user && bcryptjs.compareSync(password, user.password)) {
        req.session.user = { id: user.id, username: user.username };
        res.status(200).json({ welcome: user.username, session: req.session });
      } else {
        res.status(401).json({ you: "cannot pass" });
      }
    })
    .catch((err) => {
      console.log("error on login", err);
      res.status(500).send(err);
    });
});

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res.status(500).json({ message: "could not log out, try again" });
      } else {
        res.status(204).end();
      }
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
