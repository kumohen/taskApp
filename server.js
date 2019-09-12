const express = require("express");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const Task = require("./models/tasks");
const User = require("./models/user");


const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(__dirname + "/public"))

app.use(function(req, res, next) {
    if (req.token) {
        app.locals.req.token = req.token
    };
    next();
})

mongoose.connect("mongodb://mahen:12345a@ds161764.mlab.com:61764/taskapp",
{useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex:true,useFindAndModify:false }).then(()=>{
    console.log("mongodb is connected")
})

app.get("/",(req,res)=>{
    res.render("home")
})

app.use("/",require("./routes/tasksRoute"))
app.use("/",require("./routes/userRoute"))



const port = 5000;

app.listen(port ,()=>{
    console.log("everything is okkk")
})