const express = require("express");

const router = express.Router();

const db = require("../data/db");

// router.get("/", (req, res) => {
//   res.send("You found me");
// });

// POST create a post using information sent for request body

router.post("/", (req, res) => {
  // destructure keys off request body
  const { title, contents } = req.body;

  // check if information is valid
  if (!title || !contents) {
    // if invalid tell client and cancel request
    res.status(400).json({ message: "post requires title and contents" });
  } else {
    // if valid, add to database
    db.insert(req.body)
      .then(id => {
        res.status(201).json(id);
      })
      .catch(() => {
        // handle errors during request
        res.status(500).json({ message: "error adding post" });
      });
  }
});

module.exports = router;

// /api/posts/:id/comments Creates a comment for the post
// with the specified id using information sent inside of
// the request body.

router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  // check if a post exists thats matches post_id
  if (db.findById(id)) {
    // check if request body has text property

    if (!text) {
      // if not return 400 bad request
      res.status(400).json({ message: "posting a comment requires a message" });
    } else {
      // if validity checks pass, add the
      // comment to the database and return a
      // 201 created as well as the newly created
      // comment
      db.insertComment(req.body)
        .then(thing => {
          res.status(201).json({ message: "comment successfully created" });
        })
        .catch(() => {
          // handle errors while saving comment
          res.status(500).json({ message: "Error saving comment" });
        });
    }
  } else {
    // if not return 404 not found
    res.status(404).json({ message: "no post with that id exists" });
  }
});

// GET all posts

router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res.status(404).json({ message: "no posts found" });
    });
});

// GET post by id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  if (db.findById(id)) {
    db.findById(id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(() => {
        res.status(500).json({ message: "error retrieving post by id" });
      });
  } else {
    res.status(404).json({ message: "post not found" });
  }
});

// GET /api/posts/:id/comments
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  if (db.findById(id)) {
    db.findPostComments(id)
      .then(comments => {
        res.status(200).json(comments);
      })
      .catch(() => {
        res.status(500).json({ message: "error retrieving comments" });
      });
  } else {
    res.status(404).json({ message: "post not found" });
  }
});

// UPDATE a post by id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  db.update(id, req.body)
    .then(number => {
      if (number) {
        res.status(200).json({ message: "record updated" });
      } else {
        res.status(404).json({ message: "post not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "error updating post" });
    });
});

// DELETE a post by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  console.log("db.findById(id)", db.findById(id));

  if (db.findById(id)) {
    db.remove(id)
      .then(
        db.findById(id).then(post => {
          res.status(200).json(post);
        })
      )
      .catch(() => {
        res.status(500).json({ message: "error deleting post by id" });
      });
  } else {
    res.status(404).json({ message: "no post found" });
  }
});
