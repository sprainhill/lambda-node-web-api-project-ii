const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("You found me");
});

module.exports = router;
