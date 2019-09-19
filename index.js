const express = require("express");

const db = require("./data/db");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.status(200).json({ message: "server running" });
});

const port = 8000;
server.listen(port, () => {
  console.log("Server running on http://localhost:8000 ");
});
