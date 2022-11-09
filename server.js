
//html
const html = require('html');
const assert = require('assert');
const http = require('http');
const url = require('url');
//File
const fs = require('fs'); 
const formidable = require('express-formidable');
 //mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongourl = '';
const dbName = 'test';

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(formidable());

const express = require('express');
const app = express();
const session = require('cookie-session');



//cookies
app.use(session({
    userid: "session",  
    keys: ['th1s!sA5ecretK3y'],
    //maxAge: 90 * 24 * 60 * 60 * 1000
}));
//User Account
var users = new Array(
	{name: "mark", password: "mark"},
    {name: "admin", password: "admin"},
    {name: "student", password: "student"}
);

app.get('/',(req,res) => {
	if(!req.session.authenticated){
		res.redirect("/login");
	}
	handle_Find(req, res, {});
})

app.get('/login', (req,res) => {
	 
})
app.post('/login', (req,res) =>{
    console.log("...Handling your login request");
    users.forEach((user) => {
		if (user.name == req.fields.username && user.password == req.fields.password) {
        req.session.authenticated = true;
        req.session.userid = req.fields.username;
        console.log(req.session.userid);
        res.status(200).redirect("/home");
        }
    });
    res.redirect("/");
})
app.listen(process.env.PORT || 8099);