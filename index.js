const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5001;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Mongo Connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xcehb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(req, res) {
  try {
    await client.connect();
    const taskCollection = client.db("todoApp").collection("tasks");
    console.log("Mongo running");

    // load task
    app.get("/tasks", async (req, res) => {
      // const id = req.params.id;
      const query = {};
      const cursor = await taskCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });
    // add task
    app.post("/tasks", async (req, res) => {
      const newItem = req.body;
      console.log("added", newItem);
      const result = await taskCollection.insertOne(newItem);
      res.send([result, newItem]);
      // console.log(result);
    });

    // Update Quantity
    app.put("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      // console.log(updatedUser);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          completed: updatedUser.completed,
        },
      };
      const result = await itemCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
      console.log(result);
    });

    // Delete a task
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
      console.log(result);
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running TODO APP ");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
