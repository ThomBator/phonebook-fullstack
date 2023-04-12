const express = require("express");
const data = require("./db.json");
const path = require("path");
const fs = require("fs");
const idGenerator = require("./id-generator");
const morgan = require("morgan");
const router = express.Router();
//Add json() middleware to prase json requests
router.use(express.json());

//Add morgan to log to console
morgan.token("content", (req, res) => JSON.stringify(req.body));
router.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content "
  )
);
//GET ALL
router.get("/", async (request, response) => {
  response.json(data);
});

//GET BY ID
router.get("/:id", (request, response) => {
  const reqId = Number(request.params.id);

  const person = data.find((p) => p.id === reqId);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end("ERROR 404. Person not found.");
  }
});

//POST REQUEST
router.post("/", (request, response) => {
  const body = request.body;
  if (!body) {
    return response.status(400).end("Error 400. Request content missing.");
  }

  if (!body.name) {
    return response.status(400).end("Error 400. number is required.");
  }

  if (!body.number) {
    return response.status(400).end("Error 400. name is required.");
  }

  const existingPerson = data.find((person) => person.name === body.name);
  if (existingPerson) {
    return response
      .status(400)
      .end("Error 400. Person is already in database.");
  }

  const newId = idGenerator();
  const newPerson = {
    id: newId,
    name: body.name,
    number: body.number,
  };
  //Currently reusing similar code in the delete function
  //Will try to refactor so the file writing is its own function later
  const dbPath = path.join(__dirname, "db.json");
  return fs.writeFile(
    dbPath,
    JSON.stringify(data.concat(newPerson)),
    (error) => {
      if (error) {
        console.error(error);
        response.status(500).end("Error 500. Internal server error.");
      } else {
        response.json(`Person with id ${newId} added`);
      }
    }
  );
});

//DELETE ALL
router.delete("/:id", (request, response) => {
  const reqId = Number(request.params.id);
  const editedPersons = data.filter((p) => p.id !== reqId);
  const dbPath = path.join(__dirname, "db.json");
  return fs.writeFile(dbPath, JSON.stringify(editedPersons), (error) => {
    if (error) {
      console.error(error);
      response.status(500).end("Error 500. Internal server error.");
    } else {
      response.json(`Person with id ${reqId} deleted`);
    }
  });
});

module.exports = router;
