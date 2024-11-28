const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user_db', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/login", (req, res) => {
  const { username, name, password } = req.body;

  // Check if the username already exists
  User.findOne({ username }, (err, existingUser) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.send("Error occurred");
    }

    if (existingUser) {
      res.send("Error: Username already exists.");
    } else {
      // Create a new user
      const newUser = new User({ username, name, password });
      newUser.save((err) => {
        if (err) {
          console.error("Error inserting data:", err);
          return res.send("Error occurred");
        }

        res.render("success", { username, name, password });
      });
    }
  });
});

app.listen(4000, () => {
  console.log("Server started on http://localhost:3000");
});


