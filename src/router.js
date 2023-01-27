const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const secret = process.env.JWT_SECRET;
class WrongBodyCredentials extends Error {
  statusCode = 400;
}

const mockUser = {
  username: "authguy",
  password: "mypassword",
  profile: {
    firstName: "Chris",
    lastName: "Wolstenholme",
    age: 43,
  },
};

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username !== mockUser.username || password !== mockUser.password) {
    throw new WrongBodyCredentials("Invalid username or password");
  }
  const token = jwt.sign({ username: "authguy" }, secret);
  res.json(token);
});

router.get("/profile", (req, res) => {
  try {
    const auth = req.get("Authorization");
    jwt.verify(auth, secret);
    return res.json({ profile: mockUser.profile });
  } catch (e) {
    res.status(498).json({ message: "Invalid token" });
  }
});

module.exports = router;
