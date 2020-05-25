if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const expressLayout = require("express-ejs-layouts");
const routes = require("./routes/index");
const mongoose = require("mongoose");
// require('dotenv').config()

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/layout");

app.use(expressLayout);
app.use(express.static("public"));
// mongo db
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection

db.on('error',error=>console.error(error))
db.once('open',()=>console.log('connected to mongoDB'))


app.use("/", routes);

app.listen(process.env.PORT || 5000, () => console.log("server is runing "));
