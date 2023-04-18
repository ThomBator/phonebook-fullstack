const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://thombator:${password}@phonebook.gyio0vg.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length > 3) {
  const contactName = process.argv[3];
  const contactNumber = process.argv[4];

  const contact = new Contact({
    name: contactName,
    number: contactNumber,
  });

  contact.save().then((result) => {
    console.log(`added ${contactName} number ${contactNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}
