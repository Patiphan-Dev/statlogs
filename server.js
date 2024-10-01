const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World! Let's Working with NoSQL Databases");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const uri =
  "mongodb://adminStatlog:passStatlog@localhost:27017/?authMechanism=DEFAULT&authSource=StatlogDB";

const connectDB = async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log(`MongoDB connected successfully.`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

connectDB();

// Read All API
app.get("/statlogs", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const objects = await client
    .db("StatlogDB")
    .collection("statlogs")
    .find({})
    .sort({ Attribute: -1 })
    .limit(10)
    .toArray();
  await client.close();
  res.status(200).send(objects);
});

// Create API
app.post("/statlogs/create", async (req, res) => {
  const object = req.body;
  const client = new MongoClient(uri);
  await client.connect();
  await client.db("StatlogDB").collection("statlogs").insertOne({
    Attribute: object.Attribute,
    Description: object.Description,
    Data_Type: object.Data_Type,
    Domain: object.Domain,
  });
  await client.close();
  res.status(200).send({
    status: "ok",
    message: "Statlog is created",
    Statlog: object,
  });
});

// Update API
app.put("/statlogs/update", async (req, res) => {
  const object = req.body;
  const id = object._id;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).send({ status: "error", message: "Invalid ID" });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    
    const result = await client
      .db("StatlogDB")
      .collection("statlogs")
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            Attribute: object.Attribute,
            Description: object.Description,
            Data_Type: object.Data_Type,
            Domain: object.Domain,
          },
        }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).send({ status: "error", message: "Statlog not found or no changes made" });
    }

    res.status(200).send({
      status: "ok",
      message: "Statlog with ID = " + id + " is updated",
      Statlog: object,
    });
  } catch (error) {
    console.error("Error updating statlog:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while updating the statlog: " + error.message,
    });
  } finally {
    await client.close();
  }
});

// Delete API
app.delete("/statlogs/delete", async (req, res) => {
  try {
    const object = req.body;
    const id = object._id;

    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).send({ status: "error", message: "Invalid ID" });
    }

    const client = new MongoClient(uri);
    await client.connect();

    const result = await client
      .db("StatlogDB")
      .collection("statlogs")
      .deleteOne({ _id: new ObjectId(id) });

    await client.close();

    if (result.deletedCount === 0) {
      return res.status(404).send({
        status: "error",
        message: "Statlog not found with ID = " + id,
      });
    }

    res.status(200).send({
      status: "ok",
      ID: id,
      message: "Statlog with ID = " + id + " is deleted",
    });
  } catch (error) {
    console.error("Error deleting statlog:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while deleting the statlog: " + error.message,
    });
  }
});


// Read Limit API
app.get("/statlogs/limit", async (req, res) => {
  const client = new MongoClient(uri);
  await client.connect();
  const objects = await client
    .db("StatlogDB")
    .collection("statlogs")
    .find({})
    .sort({ Attribute: -1 })
    .limit(10000)
    .toArray();
  await client.close();
  res.status(200).send(objects);
});

// Read by id API
app.get("/statlogs/:id", async (req, res) => {
  const { params } = req;
  const id = params.id;

  if (!id || !ObjectId.isValid(id)) {
    return res.status(400).send({ status: "error", message: "Invalid ID" });
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const object = await client
      .db("StatlogDB")
      .collection("statlogs")
      .findOne({ _id: new ObjectId(id) });

    if (!object) {
      return res.status(404).send({ status: "error", message: "Statlog not found" });
    }

    res.status(200).send({
      status: "ok",
      ID: id,
      object: object,
    });
  } catch (error) {
    console.error("Error fetching statlog:", error);
    res.status(500).send({
      status: "error",
      message: "An error occurred while fetching the statlog: " + error.message,
    });
  } finally {
    await client.close();
  }
});


// Query by filter API: Search text from Attribute Name
app.get("/statlogs/attribute/:searchText", async (req, res) => {
  const { params } = req;
  const searchText = params.searchText;

  const client = new MongoClient(uri);
  try {
      await client.connect();
      const objects = await client
          .db("StatlogDB")
          .collection("statlogs")
          .find({ $text: { $search: searchText } })
          .sort({ Attribute: 1 })
          .limit(10)
          .toArray();

      res.status(200).send({
          status: "ok",
          searchText: searchText,
          Statlog: objects,
      });
  } catch (error) {
      console.error("Error querying statlogs:", error);
      res.status(500).send({
          status: "error",
          message: "Internal server error",
          error: error.message, // เพิ่มข้อความข้อผิดพลาด
      });
  } finally {
      await client.close();
  }
});


