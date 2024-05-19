const express = require("express");
const app = express();
const port = 3000;
const expressLayouts = require("express-ejs-layouts");
const { loadContact, findContact, addContact, checkUsers, deleteContact, updateContacts } = require("./utils/contact.js");
const { query, validationResult, body, check } = require("express-validator");
const session = require("express-session");
const cookieParser = require("cookie-parser");
var flash = require("connect-flash");

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("index", { layout: "layouts/main-layouts", title: "Home" });
});
app.get("/about", (req, res) => {
  res.render("about", { layout: "layouts/main-layouts", title: "About" });
});
app.get("/profile", (req, res) => {
  res.render("profile", {
    layout: "layouts/main-layouts",
    title: "Profile",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", { layout: "layouts/main-layouts", title: "Contact", contacts, msg: req.flash("msg") });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", { layout: "layouts/main-layouts", title: "Tambah kontak baru" });
});

app.post(
  "/contact",
  [
    body("nama").custom((value) => {
      const existingUser = checkUsers(value);
      if (existingUser) {
        throw new Error("Nama kontak sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid, silahkan mengisi email dengan benar").isEmail(),
    check("nama", "Panjang nama harus lebih dari 5 karakter").isLength({ min: 5 }),
    check("nohp", "Nomor handphoe yang anda masukkan tidak terdaftar").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Add Contact",
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } else {
      console.log(req.body);
      addContact(req.body);
      req.flash("msg", "Data contact berhasil ditambahkan");
      res.redirect("/contact");
    }
  }
);

// proses delete contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);

  if (!contact) {
    res.status(404);
    res.send("<h1>Data tidak ditemukan</h1>");
  } else {
    deleteContact(req.params.nama);
    req.flash("msg", "Contact berhasil dihapus");
    res.redirect("/contact");
  }
});

app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contacts", { layout: "layouts/main-layouts", title: "Form ubah data", contact });
});

app.get("/contact/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("detail", { layout: "layouts/main-layouts", title: "Detail Contact", contact });
});

// proses ubah data
app.post(
  "/contact/update",
  [
    body("nama").custom((value, { req }) => {
      const existingUser = checkUsers(value);
      if (value !== req.body.oldNama && existingUser) {
        throw new Error("Nama kontak sudah terdaftar");
      }
      return true;
    }),
    check("email", "Email tidak valid, silahkan mengisi email dengan benar").isEmail(),
    check("nama", "Panjang nama harus lebih dari 5 karakter").isLength({ min: 5 }),
    check("nohp", "Nomor handphoe yang anda masukkan tidak terdaftar").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contacts", {
        title: "Form ubah data contact",
        layout: "layouts/main-layouts",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      req.flash("msg", "Data contact berhasil diubah!");
      res.redirect("/contact");
    }
  }
);

app.get("/test", (req, res) => {
  const siswaList = [
    {
      nama: "Naufal Nabil Ramadhan",
      kelas: 10,
      jurusan: "Rekayasa Perangkat Lunak",
    },
    {
      nama: "Fahrell Sandy Zhariif Widiatmoko",
      kelas: 10,
      jurusan: "Rekayasa Perangkat Lunak",
    },
    {
      nama: "Muhammad Syamil Muwahhid",
      kelas: 10,
      jurusan: "Rekayasa Perangkat Lunak",
    },
  ];
  res.render("test", { layout: "layouts/main-layouts", myname: "Naufal Nabil Ramadhan", title: "Test EJS", siswa: siswaList });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("Not Found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log("open in http://localhost:3000");
});
