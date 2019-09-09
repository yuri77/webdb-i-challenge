const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Hello from accounts");
// });

router.get("/", (req, res) => {
  db("accounts")
    .select("*")
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

module.exports = router;
