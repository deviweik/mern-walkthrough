import express from "express";

import db from "../db/connection.js";

import { ObjectId } from "mongodb";


// router is an instance of the express router, used to define our routes
// router will be added as a middleware and will take control of requests
// starting with path /record
const router = express.Router();

// GET /record - fetch all records
router.get("/", async (req, res) => {
  const collection = db.collection("records");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
})


// GET /record/id - fetch single record by id
router.get("/:id", async (req, res) => {
  const collection = db.collection("records");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.status(200).send(result);
});

// POST /record - create a new record
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    };
    const collection = db.collection("records");
    let result = await collection.insertOne(newDocument);
    res.status(204).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

// PATCH /record/id - update a record
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        position: req.body.position,
        level: req.body.level,
      },
    };

    const collection = db.collection("records");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

// DELETE /record/id - delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("records");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;