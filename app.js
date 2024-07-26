const express = require("express");
const serveIndex = require("serve-index");
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const directory = "./uploads";
fs.readdir(directory, (err) => {
  if (err)
    fs.mkdir(path.join(__dirname, directory), (err) => {
      if (err) throw err;
    });
});

// Use JSON and URL-encoded parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// root
app.get("/", function (request, response) {
  response.render("index", { authenticated: false });
});

app.post("/authenticate", function (request, response) {
  let authenticated = false;
  const enteredPassword = request.body.password; // You can use query parameters for simplicity here
  const enteredUsername = request.body.username; // You can use query parameters for simplicity here

  if (
    enteredPassword === process.env.APPPASSWORD &&
    enteredUsername === process.env.APPUSERNAME
  ) {
    authenticated = true;
  }
  response.render("index", { authenticated });
});

// view uploads
app.use(
  "/uploads",
  express.static(directory),
  serveIndex(directory, { icons: true })
);

//upload
app.post("/upload", upload.array("myfile", 10), (req, res) => {
  try {
    //res.send(req.files);
    res.redirect("/uploads");
  } catch (error) {
    console.log(error);
    res.send(400);
  }
});

app.delete("/delete", function name(req, res) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(err);
      return res.json({ status: "error" });
    }
    for (const file of files) {
      fs.unlink(path.join(directory, file), (err) => {
        if (err) console.error(err);
      });
    }
    return res.json({ status: "ok" });
  });
});

const PORT = process.env.PORT || "5000";

app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});
