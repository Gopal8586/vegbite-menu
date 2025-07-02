const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.use('/images', express.static('images'));

// ✅ Add prices here (key = file name without extension)
const priceMap = {
  "chai": 20,
  "coffe": 25,
  "cold_coffee": 40,
  "lemonate": 30,
  "mango": 35,
  "smoothiesmangotang": 45,
  "water": 10,
  "missi_roti": 15,
  "naan_roti": 20,
  "puri": 25,
  "rumali_roti": 18,
  "tava_roti": 12,
  "cake": 60,
  "gulab_jamun": 50,
  "ice_cream": 55,
  "kheer": 45,
  "pastry": 50,
  "rasmalai": 70,
  "daalmakhn": 90,
  "dosa": 50,
  "idli": 40,
  "litti_chokha": 60,
  "malai_kofta": 100,
  "masaladosa": 55,
  "palak_paneer": 90,
  "paneerbuuter": 95,
  "cheeseburge": 70,
  "chowmein": 60,
  "lasanga": 80,
  "manchurian": 65,
  "medu_vada": 35,
  "paneer_tikka": 85,
  "pizza": 90
};

const formatName = (filename) =>
  filename
    .split('.')[0]
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

const getPrice = (filename) => {
  const key = filename.split('.')[0].toLowerCase();
  return priceMap[key] || 100; // default price
};

// ✅ GET all menu items
app.get('/menu', (req, res) => {
  const imageBasePath = path.join(__dirname, 'images');
  const categories = fs.readdirSync(imageBasePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let idCounter = 1;
  const menu = [];

  categories.forEach(category => {
    const categoryPath = path.join(imageBasePath, category);
    const items = fs.readdirSync(categoryPath);

    items.forEach(filename => {
      if (!/\.(png|jpg|jpeg)$/i.test(filename)) return;

      const name = formatName(filename);
      const image = `http://localhost:3000/images/${category}/${filename}`;
      const price = getPrice(filename);

      menu.push({
        id: idCounter++,
        name,
        category,
        image,
        price
      });
    });
  });

  res.json(menu);
});

// ✅ GET specific dish by ID
app.get('/menu/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const imageBasePath = path.join(__dirname, 'images');
  const categories = fs.readdirSync(imageBasePath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  let idCounter = 1;
  const menu = [];

  categories.forEach(category => {
    const categoryPath = path.join(imageBasePath, category);
    const items = fs.readdirSync(categoryPath);

    items.forEach(filename => {
      if (!/\.(png|jpg|jpeg)$/i.test(filename)) return;

      const name = formatName(filename);
      const image = `http://localhost:3000/images/${category}/${filename}`;
      const price = getPrice(filename);

      menu.push({
        id: idCounter++,
        name,
        category,
        image,
        price
      });
    });
  });

  const item = menu.find(m => m.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: "Dish not found" });
  }
});

// ✅ Home
app.get('/', (req, res) => {
  res.send("Welcome to VegBites API!");
});

// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ VegBites API running at http://localhost:${PORT}`);
});
