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

const Review = require("./models/reviews");


app.get("/api/products/:productId/reviews", async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.findAll({
      where: { productId },
      include: [{ model: User, attributes: ['email', 'id'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania opinii" });
  }
});


app.get("/api/reviews", auth, requireAdmin, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [{ model: User, attributes: ['email', 'id'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania wszystkich opinii" });
  }
});


app.post("/api/reviews", auth, async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.userId;

  if (!rating || !comment || !productId) {
    return res.status(400).json({ error: "Rating, comment, and productId are required" });
  }

  try {
    const existingReview = await Review.findOne({
      where: { userId, productId }
    });

    if (existingReview) {
      return res.status(400).json({ error: "Już dodałeś opinię dla tego produktu" });
    }

    const review = await Review.create({
      userId,
      productId,
      rating,
      comment
    });

    const fullReview = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['email', 'id'] }]
    });

    res.json(fullReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd dodawania opinii" });
  }
});



app.put("/api/reviews/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.userId;

  try {
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (review.UserId !== userId) {
      return res.status(403).json({ error: "Nie możesz edytować cudzej opinii" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd edycji opinii" });
  }
});


app.delete("/api/reviews/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (Number(review.userId) !== Number(userId) && userRole !== 'admin') {
      return res.status(403).json({ error: "Brak uprawnień do usunięcia tej opinii" });
    }

    await review.destroy();
    res.json({ message: "Opinia usunięta" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd usuwania opinii" });
  }
});

sequelize.sync({ alter: true });

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
