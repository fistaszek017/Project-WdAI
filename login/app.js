const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const sequelize = require("./models");
const User = require("./models/users");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "super_tajny_klucz";

app.use(express.json());

const PORT = 3000; //port - to pewnie bedziemy zmieniac

function auth(req, res, next) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Brak tokena" });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Nieprawidłowy token" });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Wymagana rola admin" });
  }
  next();
}


app.post("/api/users", async (req, res) => { //create user
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email i password są wymagane" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ email, passwordHash });

  res.json({ id: user.id });
});

app.post("/api/login", async (req, res) => { //login
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    return res.status(401).json({ error: "Nieprawidłowy email lub hasło" });
  }

  const token = jwt.sign( 
    {userId: user.id, email: user.email, role: user.role },
    JWT_SECRET, { expiresIn: "1h" }
  );

  res.json({ token });
});



sequelize.sync();

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
