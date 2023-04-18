require("dotenv").config();
const express = require("express");
const persons = require("./persons");
const info = require("./info");
const app = express();
const cors = require("cors");
const Contact = require("./ models/contacts");
const PORT = process.env.PORT || 5000;

//Tells express app to load build folder
app.use(express.static("build"));

//Tells express app to use express.json() middleware to parse any JSON into strings that can be read by JS
app.use("/api/persons", persons);

//Allow cross-origin requests
app.use(cors());

//app.listen() is required to start server and have it listening for requests on a specific port

app.get("/", (request, response) => {
  response.send(`Connected on ${PORT}. Use /api/persons to access db routes.`);
});

app.get("/info", (request, response) => {
  const dbInfo = info();
  response.send(dbInfo);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
