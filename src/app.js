const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const db = require("./database/connection");
const productRouter = require('./routes/products/products.router');
const loginRouter = require('./routes/login/login.router');
db.connectDB();
const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(morgan('combined'));

app.use('/product', productRouter);
app.use('/login', loginRouter);

module.exports = app