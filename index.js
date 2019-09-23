const express = require("express");
const cors = require("cors");
const db = require("./data/db");

// custom middleware
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}]  ${req.method} to ${req.url} from ${req.get(
      "Origin"
    )} `
  );
  next();
}

function atGate(req, res, next) {
  console.log(`At the gate, about to be eaten`);

  next();
}

// routes
const postRoutes = require("./routes/posts");

// initialize server instance
const server = express();

// middleware
server.use(express.json()); // parse incoming json
server.use(logger); // add custom middleware logging
server.use(cors()); // allow cors
server.use(atGate);

server.use("/api/posts", postRoutes);
// server.use("/api", (req, res) => res.send("API running"));

// Write a request handler that responds with a custom message
// for invalid URLs

server.use(function(req, res) {
  res.status(404).send("Aint nobody got time for that!");
});

const port = 8000;
server.listen(port, () => {
  console.log("Server running on http://localhost:8000 ");
});
