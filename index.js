const express = require("express");
const cors = require("cors");
const db = require("./data/db");

// routes
const postRoutes = require("./routes/posts");

// initialize server instance
const server = express();

// middleware
server.use(express.json()); // parse incoming json
server.use(cors()); // allow cors

server.use("/api/posts", postRoutes);
server.use("/api", (req, res) => res.send("API running"));

const port = 8000;
server.listen(port, () => {
  console.log("Server running on http://localhost:8000 ");
});
