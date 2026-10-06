const express = require("express");
var morgan = require('morgan')
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'))

morgan.token("body", (call)=> call.method == 'POST' ? JSON.stringify(call.body) : "")

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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

app.get("/info", (request, response) => {
	response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <p>${new Date().toString()}</p>`);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	response.json(persons.find((person) => person.id == id));
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	persons = persons.filter((person) => person.id != id);
	response.status(204).end();
});

app.post("/api/persons", (request, response) => {
	
    if (!request.body.name || !request.body.number) {
		return response.status(400).json({
			error: "name or number is missing",
		});
	}

     if (persons.find((person) => person.name == request.body.name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}



	let person = {
		id: Math.floor(Math.random() * 1000000),
		name: request.body.name,
		number: request.body.number,
	};
	persons.push(person);
	response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
