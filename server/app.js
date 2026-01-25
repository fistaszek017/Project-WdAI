const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const sequelize = require("./models");
const User = require("./models/users");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "super_tajny_klucz";

const cors = require("cors");
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

  res.json({ id: user.id, email: user.email, role: 'user' });
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
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET, { expiresIn: "1h" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role }
  });
});



const { Order, OrderItem } = require("./models/orders");

app.post("/api/orders", auth, async (req, res) => {
  const { items, shipping } = req.body;
  const userId = req.user.userId;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: "Koszyk jest pusty" });
  }

  try {
    const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const order = await Order.create({
      UserId: userId,
      totalPrice,
      status: 'pending',
      shippingName: shipping.name,
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingZip: shipping.zip
    });

    for (const item of items) {
      await OrderItem.create({
        OrderId: order.id,
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        size: item.size
      });
    }

    res.json({ message: "Zamówienie złożone", orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas składania zamówienia" });
  }
});

app.get("/api/orders", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [OrderItem],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania zamówień" });
  }
});

sequelize.sync();

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
