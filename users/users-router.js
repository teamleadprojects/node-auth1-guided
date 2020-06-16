const router = require("express").Router();

const Users = require("./users-model.js");

router.get("/", (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.send(err));
});
// router.post("/register", (req, res) => {
//   let newUser = req.body;
//   Users.add(newUser)
//     .then((user) => {
//       res.status(201).json(user);
//     })
//     .catch((err) => res.send(err));
// });

module.exports = router;
