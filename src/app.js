const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const db = require("./database/connection");
const productRouter = require('./routes/products/products.router');
const loginRouter = require('./routes/login/login.router');
const newsRouter = require('./routes/news/news.router');
const userRouter = require('./routes/users/users.router');
const cartRouter = require('./routes/carts/carts.router');
const brandsRouter = require('./routes/brands/brands.router');
const shipsRouter = require('./routes/ship/ship.router');
const promotionsRouter = require('./routes/promotions/promotions.router');
const bodyParser = require('body-parser')

db.connectDB();
const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.json());

app.use(morgan('combined'));

app.use('/product', productRouter);
app.use('/news', newsRouter);
app.use('/login', loginRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/brand', brandsRouter);
app.use('/ship', shipsRouter);
app.use('/promotion', promotionsRouter);

module.exports = app