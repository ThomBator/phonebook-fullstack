const express = require("express");
const morgan = require("morgan");
const router = express.Router();
const errorHandler = require("./error-handler");
const Contact = require("./ models/contacts");
//Add json() middleware to prase json requests
router.use(express.json());

//Add morgan to log to console
morgan.token("content", (request, response, next) =>
  JSON.stringify(request.body)
);
router.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :content "
  )
);
//GET ALL
router.get("/", async (request, response, next) => {
  Contact.find({}).then((contacts) => {
    response.json(contacts);
  });
});

//GET BY ID
router.get("/:id", (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

//POST REQUEST
router.post("/", (request, response, next) => {
  const body = request.body;
  if (body.name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  if (body.number === undefined) {
    return response.status(400).json({ error: "number missing" });
  }

  const contact = new Contact({
    name: body.name,
    number: body.number,
  });

  contact
    .save()
    .then((savedContact) => {
      response.json(savedContact);
    })
    .catch((error) => next(error));
});

//UPDATE

router.put("/:id", (request, response, next) => {
  const { name, number } = request.body;

  if (name === undefined) {
    return response.status(400).json({ error: "name missing" });
  }

  if (number === undefined) {
    return response.status(400).json({ error: "number missing" });
  }

  //When doing put and patch, dont create a new Contact as this will auto create an _id through Mongoose.

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  ) //There is a default that sends the unmodified document without modifications, new: true makes sure the updated version from the request is used.
    .then((updatedContact) => {
      response.json(updatedContact);
    })
    .catch((error) => next(error));
});

//DELETE
router.delete("/:id", (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

router.use(errorHandler);

module.exports = router;
