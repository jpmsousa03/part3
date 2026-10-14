const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://joaopedro03msousa_db_user:${password}@cluster0.i0xihmx.mongodb.net/?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});
const Person = mongoose.model("person", personSchema);

if (process.argv.length < 4) {
	Person.find({}).then((persons) => {
		console.log("phonebook:");
		persons.forEach((person) => console.log(person.name + " " + person.number));
		mongoose.connection.close();
	});
    return;
}

const name = process.argv[3];
const number = process.argv[4];

const person = new Person({
	name: name,
	number: number,
});

person.save().then((result) => {
	console.log(`Added ${result.name} number ${result.number} to phonebook`);
	mongoose.connection.close();
});

