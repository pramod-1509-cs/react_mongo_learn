var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");

var app = Express();
app.use(cors());

var CONNECTION_STRING =
  "mongodb+srv://pramodkumta26:5Xh8UdTmNa2PwO7M@cluster0.sltlrvk.mongodb.net/?retryWrites=true&w=majority";

var DATABASE = "database_doc1";
var database;

app.listen(5038, () => {
  MongoClient.connect(CONNECTION_STRING, (error, client) => {
    database = client.db(DATABASE);
    console.log("Connected to `" + DATABASE + "`!");
  });
});

app.get("/api/todoapp/GetNotes", (req, res) => {
  database
    .collection("collection1")
    .find({})
    .toArray((error, result) => {
      res.send(result);
    });
});

app.post("/api/todoapp/AddNotes", multer().none(), (req, res) => {
  database.collection("collection1").count({}, function (error, numOfDocs) {
    database.collection("collection1").insertOne({
      id: (numOfDocs + 1).toString(),
      desc: req.body.newNotes,
    });
    res.json("Added document successfully");
  });
});

app.put("/api/todoapp/UpdateNotes", multer().none(), (req, res) => {
  const id = req.query.id;

  if (!id) {
    res.status(400).json("Missing 'id' parameter");
    return;
  }

  database
    .collection("collection1")
    .updateOne(
      { id: id },
      { $set: { desc: req.body.updatedNote } },
      (error, result) => {
        if (error) {
          res.status(500).json("Error updating document");
        } else {
          res.json("Updated document successfully");
        }
      }
    );
});

app.delete("/api/todoapp/DeleteNotes", (req, res) => {
  const id = req.query.id;

  if (!id) {
    res.status(400).json("Missing 'id' parameter");
    return;
  }

  database.collection("collection1").deleteOne({ id: id }, (error, result) => {
    if (error) {
      res.status(500).json("Error deleting document");
    } else {
      res.json("Deleted document successfully");
    }
  });
});
