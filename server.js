if (process.env.NODE_ENV != 'production') {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose = require("mongoose");
//ROUTES
const authorRoutes = require('./routes/authors')
const bookRoutes = require('./routes/books')
const routes = require("./routes/index");
const methodOverrides = require('method-override');

//SET
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
//USE
app.use(expressLayout);
app.use(methodOverrides('_method'))
app.use(express.static("public"));
// app.use(express.json())
app.use(express.urlencoded({ extended: false, limit: '5mb' }))
app.use('/author', authorRoutes)
app.use("/", routes);
app.use('/books', bookRoutes)
// mongo db
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection

db.on('error', error => console.error(error))
db.once('open', () => console.log('connected to mongoDB'))
const port = process.env.PORT || 5000

app.listen(port, () => console.log("server is runing at : "+port));
