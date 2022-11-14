
//html
const html = require('html');
//const html = require('html');
const assert = require('assert');
const http = require('http');
const url = require('url');
//File
const fs = require('fs'); 
const formidable = require('express-formidable');
const express = require('express');
const app = express();
const session = require('cookie-session');
const bodyParser = require('body-parser');
 //mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongourl = 'mongodb+srv://mark:1234567!@cluster0.cmqjfdr.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'bookWell';

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(formidable());
app.use(express.static('public'));

//create new inventory docs


//Middleware
app.use(bodyParser.json());
//cookies
app.use(session({
    userid: "session",  
    keys: ['th1s!sA5ecretK3y'],
    type: ""
    //maxAge: 90 * 24 * 60 * 60 * 1000
}));
//User Account
var users = new Array(
	{name: "mark", password: "mark"},
    {name: "student", password: "student"}
);
var Admins = new Array(
    {name:"Admin", password:"Admin"},
    {name:"Mark", password:"Mark"}
);
app.get('/',(req,res) => {
	if(!req.session.authenticated){
		res.redirect("/login");
	}
	handle_Find(req, res, {});
})
//admin login methods
app.get('/adminlogin', (req,res) => {
    res.status(200).render("adminLogin.ejs");
})
app.post('/adminlogin', (req,res) => {
    Admins.forEach((admin) => {
		if (admin.name == req.fields.username && admin.password == req.fields.password) {
        req.session.authenticated = true;
        req.session.userid = req.fields.username;
        req.session.type = "admin";
        console.log(req.session.userid);
        res.status(200).redirect("/home");
        }
    });
    res.redirect("/");
})

//login methods
app.get('/login', (req,res) => {
    res.status(200).render("login.ejs");
})
app.post('/login', (req,res) =>{
    console.log("...Handling your login request");
    users.forEach((user) => {
		if (user.name == req.fields.username && user.password == req.fields.password) {
        req.session.authenticated = true;
        req.session.userid = req.fields.username;
        req.session.type = "user";
        console.log(req.session.userid);
        res.status(200).redirect("/home");
        }
    });
    res.redirect("/");
})
//check login status
app.use((req, res, next) => {
    console.log("...Checking login status");
    if (req.session.authenticated && req.session.type =="user"){
      next();
    } else if(req.session.authenticated && req.session.type =="admin"){
        res.redirect("/admin");
    }
    else {
      res.redirect("/login");
    }
});
//home page
app.get('/home', (req,res) => {
    res.status(200).render("admin.ejs");
})
app.listen(process.env.PORT || 8099);