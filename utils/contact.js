const fs = require("fs");

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// membuat file contact.json jika belum ada
const contactFile = "./data/contact.json";
if (!fs.existsSync(contactFile)) {
  fs.writeFileSync(contactFile, "[]");
}

// ambil semua data di contact.json
const loadContact = () => {
  const file = fs.readFileSync("data/contact.json", "utf-8", (err) => {
    console.error(err);
  });
  const contact = JSON.parse(file);
  return contact;
};

// cari contact berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toString() === nama.toString());
  return contact;
};

// menimpa file contact.json dengan data yang baru
const saveContacts = (contacts) => {
  fs.writeFileSync("data/contact.json", JSON.stringify(contacts));
};
// menambah data contact baru ke dalam array
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// cek duplikat
const checkUsers = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

const deleteContact = (nama) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama !== nama);
  saveContacts(filteredContacts);
};

// mengubah contacts
const updateContacts = (contactBaru) => {
  const contacts = loadContact();
  //  hilangkan contact lama yang namanya sama dengan oldNama
  const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama);
  console.log(filteredContacts, contactBaru);
  delete contactBaru.oldNama;
  filteredContacts.push(contactBaru);
  saveContacts(filteredContacts);
};

module.exports = { loadContact, findContact, addContact, checkUsers, deleteContact, updateContacts };
