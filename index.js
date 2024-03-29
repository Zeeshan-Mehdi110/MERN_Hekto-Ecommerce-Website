require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const userController = require("./controllers/users");
const categoryController = require("./controllers/categories");
const productController = require("./controllers/products");
const reviewController = require("./controllers/reviews");
const siteController = require("./controllers/configurations");
const brandController = require("./controllers/brands");


// app.use
app.use(express.json());
app.use('/content', express.static('content/'));
app.use(express.static(__dirname + `/client/build`))
app.use(express.static(__dirname + `/admin/build`))
app.use(cors())

app.use('/api/users', userController);
app.use('/api/categories', categoryController);
app.use('/api/products', productController);
app.use('/api/reviews', reviewController);
app.use('/api/store', siteController);
app.use('/api/brands', brandController);

app.all("*", (req, res) => {
  if (req.url.includes('/admin/')) {
    res.sendFile(__dirname + `/admin/build/index.html`);
  } else {
    res.sendFile(__dirname + `/client/build/index.html`);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(400).json({ error: err.message });
  } else {
    next();
  }
});

mongoose.connect(process.env.MONGODB_CONNECTION_URI).then(() => {
  console.log("Database is connected successfully!");
}).catch(err => {
  console.log(`Error`, err);
});


app.listen(5000, () => {
  console.log(`App listening at Port 5000`);
});
