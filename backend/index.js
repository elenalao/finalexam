// Importing necessary packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Creating an Express app
const app = express();
const port = process.env.PORT || 5000; // Setting the port for the server

// Middleware setup
app.use(cors()); // Allowing Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parsing incoming request bodies in JSON format

// Connecting to MongoDB database
const uri = "mongodb://localhost:27017/ArtList"; // MongoDB connection URI
mongoose.connect(uri); // Establishing connection
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database successfully connected"); // Logging a success message once connected
});

// Defining MongoDB schema for arts
const Schema = mongoose.Schema;
const artSchema = new Schema(
  {
    artName: { type: String }, // Art name
    serial: { type: Number }, // Serial number
    src: { type: String, required: true }, // Source URL
    alt: { type: String }, // Alternate text
    bids: { // Array of bids
      type: Array,
      items: {
        type: Object,
        properties: {
          user: { type: String, required: true }, // Bidder's name
          bid: { type: Number, required: true }, // Bid amount
        },
      },
    },
  },
  { collection: "artrecords" } // MongoDB collection name
);

// Creating a MongoDB model for arts
const ArtModel = mongoose.model("Art", artSchema);

// Route to get all arts
app.get("/api/arts", (req, res) => {
  ArtModel.find() // Finding all art records
    .then((arts) => res.json(arts)) // Sending the found art records as JSON response
    .catch((err) => res.status(404).json("Server Error")); // Handling errors
});

// Route to get a specific art by ID
app.get("/api/art/:id", (req, res) => {
  ArtModel.findById(req.params.id) // Finding art by ID
    .then((art) => res.json(art)) // Sending the found art as JSON response
    .catch((err) => res.status(404).json("Server Error")); // Handling errors
});

// Route to add a new art
app.post("/api/art", async (req, res) => {
  // Extracting art data from request body
  const { artName, serial, src, alt, bids } = req.body;
  // Creating a new art object
  const newArt = new ArtModel({ artName, serial, src, alt, bids });
  newArt
    .save() // Saving the new art to the database
    .then(() => res.json("New Art uploaded")) // Sending success response
    .catch((err) => res.status(500).json("Server Error")); // Handling errors
});

// Route to update an existing art by ID
app.post("/api/art/:id", async (req, res) => {
  // Finding the art by ID and updating its fields
  ArtModel.findById(req.params.id)
    .then((ArtRecordUpdate) => {
      ArtRecordUpdate.artName = req.body.artName;
      ArtRecordUpdate.serial = req.body.serial;
      ArtRecordUpdate.src = req.body.src;
      ArtRecordUpdate.alt = req.body.alt;
      ArtRecordUpdate.bids = req.body.bids;

      ArtRecordUpdate.save() // Saving the updated art record
        .then(() => res.json("Existing Art updated")) // Sending success response
        .catch((err) => res.status(404).json("Server Error")); // Handling errors
    })
    .catch((err) => res.status(404).json("Server Error")); // Handling errors
});

// Route to delete an art by ID
app.delete("/api/art/:id", async (req, res) => {
  // Finding and deleting the art by ID
  ArtModel.findByIdAndDelete(req.params.id)
    .then(() => res.json("Art record deleted.")) // Sending success response
    .catch((err) => res.status(404).json("Server Error")); // Handling errors
});

// Handling 404 errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
    },
  });
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port : ${port}`); // Logging a message once the server starts
});