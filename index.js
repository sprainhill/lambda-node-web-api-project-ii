const express = require("express");
const cors = require("cors");
const db = require("./data/db");
const path = require("path");

// custom middleware
function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}]  ${req.method} to ${req.url} from ${req.get(
      "Origin"
    )} `
  );
  next();
}

function auth(req, res, next) {
  if (req.url === "/mellon") {
    next();
  } else {
    res.send("You shall not pass!");
  }
}

// routes
const postRoutes = require("./routes/posts");

// initialize server instance
const server = express();

// middleware
server.use(express.json()); // parse incoming json
server.use(logger); // add custom middleware logging
server.use(cors()); // allow cors
// declare and use middleware inline

// write an endpoint that sends a file to the client
// in response to a GET request to the /download endpoint
server.get("/download", (req, res, next) => {
  const filePath = path.join(__dirname, "index.html");
  res.sendFile(filePath, err => {
    // if there is an error the callback function willl get an error
    // as its first argument
    if (err) {
      // can handle error here or pass it down to error handling middleware
      next(err); // call the next error handling middleware in the queue
    } else {
      console.log("File sent successfully");
    }
  });
});

server.use((err, req, res, next) => {
  console.log("error", err);

  res.status(500).json({ message: "Error performing required operation" });
});

server.use("/api/posts", postRoutes);
// server.use("/api", (req, res) => res.send("API running"));

// Write a request handler that responds with a custom message
// for invalid URLs

// server.use(function(req, res) {
//   res.status(404).send("Aint nobody got time for that!");
// });

// custom middleware endpoint
server.get("/mellon", auth, (req, res) => {
  console.log("Gate opening...");
  console.log("Inside and safe");
  console.log("Welcome weary traveler!");
});

const port = 8000;
server.listen(port, () => {
  console.log("Server running on http://localhost:8000 ");
});
