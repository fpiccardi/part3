const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><br/><p>${Date()}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//add id to url
app.get("/api/persons/:id", (request, response) => {
  //get id from request
  const id = request.params.id;
  //use id to find the note
  const person = persons.find((person) => person.id === id);

  //if the note is found
  if (person) {
    //return it in the response
    response.json(person);
  } else {
    //otherwise
    //send response status 404
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  //use id to find that entry
  const id = request.params.id;
  //delete it from the persons array
  persons = persons.filter((person) => person.id !== id);
  //return response status 204
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  //save reqs body
  const body = request.body;

  //if no body is passed return 400 - bad request
  if (!body) {
    return response.status(400).json({ error: "content missing" });
  }

  //if name or number are missing return 400 - bad request
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "properties missing" });
  }

  //if name already exists in the phonebook return 409 - conflict
  if (persons.some((person) => person.name === body.name)) {
    return response.status(409).json({ error: "name must be unique" });
  }

  //generate a random id from 0 to 1_000_000
  const id = String(Math.round(Math.random() * 1_000_000));

  //create a new person with the id
  const newPerson = {
    id: id,
    ...body,
  };

  //add new person
  persons.push(newPerson);

  //return success
  return response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
