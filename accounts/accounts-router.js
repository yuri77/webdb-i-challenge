const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Hello from accounts");
// });

router.get("/", (req, res) => {
  db("accounts")
    .select("*")
    .orderBy("budget", "desc")
    .then(accounts => res.status(200).json(accounts))
    .catch(err => {
      console.log("get endpoint error", err),
        res.status(500).json({ error: "acounts couldn't be retrieved" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db("accounts")
    .where({ id })
    .first()
    .then(account => res.status(200).json(account))
    .catch(err => {
      console.log("get id error", err);
      res.status(500).json({ error: "couldn't retrieve data from database" });
    });
});

router.post("/", (req, res) => {
  const { name, budget } = req.body;
  if (!name || !budget) {
    res.status(404).json({ error: "please provide all required fields" });
  }

  db("accounts")
    .insert({ name, budget }, "id")
    .then(([id]) => {
      db("accounts")
        .where({ id })
        .first()
        .then(account => {
          res.status(200).json(account);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "error finding the id" });
        });
    })
    .catch(err => {
      console.log("post err", err);
      res.status(500).json({ err: "err posting data" });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;

  db("accounts")
    .where("id", req.params.id)
    .update(changes)
    .then(count => {
      res.status(200).json({ message: `updated ${count} record` });
    })
    .catch(err => {
      res.status(500).json({ err: "cannot update entry" });
    });
});

router.delete("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `delete complete` });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
