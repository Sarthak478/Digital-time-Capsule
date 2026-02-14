const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const capsulesFile = path.join(__dirname, "capsules.json");
let capsules = [];

if (fs.existsSync(capsulesFile)) {
  capsules = JSON.parse(fs.readFileSync(capsulesFile));
}


app.get("/", (req, res) => {
  res.render("index", { capsules });
});

app.post("/create", (req, res) => {
  const { message, unlockDate } = req.body;
  capsules.push({ message, unlockDate });
  fs.writeFileSync(capsulesFile, JSON.stringify(capsules, null, 2));
  res.redirect("/");
});

app.get("/capsule/:id", (req, res) => {
  const capsule = capsules[req.params.id];
  if (!capsule) return res.status(404).send("Capsule not found");

  const now = new Date();
  const unlock = new Date(capsule.unlockDate);
  const isUnlocked = now >= unlock;

  res.render("capsule", { capsule, isUnlocked });
});

app.get("/api/capsules", (req, res) => {
  res.json(capsules);
});

app.post("/api/capsules", (req, res) => {
  const { message, unlockDate } = req.body;
  if (!message || !unlockDate) {
    return res.status(400).json({ error: "Message and unlockDate required" });
  }
  capsules.push({ message, unlockDate });
  fs.writeFileSync(capsulesFile, JSON.stringify(capsules, null, 2));
  res.json({ success: true, capsule: { message, unlockDate } });
});

app.get("/api/capsules/:id", (req, res) => {
  const capsule = capsules[req.params.id];
  if (!capsule) return res.status(404).json({ error: "Capsule not found" });

  const now = new Date();
  const unlock = new Date(capsule.unlockDate);
  const isUnlocked = now >= unlock;

  res.json({ capsule, isUnlocked });
});

app.listen(PORT, () => {
  console.log(`Time capsule running at http://localhost:${PORT}`);
});