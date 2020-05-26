if(process.env.NODE_ENV != 'production'){
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

//SET
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");
//USE
app.use(expressLayout);
app.use(express.static("public"));
// app.use(express.json())
app.use(express.urlencoded({extended:false,limit:'5mb'}))
app.use("/", routes);
app.use('/author',authorRoutes)
app.use('/books',bookRoutes)
// mongo db
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection

db.on('error',error=>console.error(error))
db.once('open',()=>console.log('connected to mongoDB'))

app.listen(process.env.PORT || 5000, () => console.log("server is runing "));
