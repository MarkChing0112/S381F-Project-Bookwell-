//html
const html = require('html');
const assert = require('assert');
const url = require('url');
//File
const fs = require('fs'); 
const formidable = require('express-formidable');
//mongodb
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const mongourl = 'mongodb+srv://mark:1234567!@cluster0.cmqjfdr.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'bookWell';
//const dbName = 'test';
const express = require('express');
const app = express();
const session = require('cookie-session');


const bodyParser = require('body-parser');

const { Buffer } = require('safe-buffer');

app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
//Login
app.use(formidable());
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
    {name:"admin",password:"admin"},
    {name:"Mark", password:"Mark"}
);
var DOC = {};


const insertDocument = (db, doc, callback) => {
	//db.createCollection('bookings');     
	db.collection('bookings').
    insertMany(doc, (err, results) => {
        assert.equal(err,null);
        console.log(`Inserted document(s): ${results.insertedCount}`);
        callback();
    });
}

//create new inventory docs
const createDocument = (db, createDoc, callback) => {
    const client = new MongoClient(mongourl);

    client.connect((err) =>{
        assert.equal(null, err);
        console.log("Connected successfully to the DB server.");
        db.collection('book').insert(createDoc, (error, results)=>{
            assert.equal(err,null);
            console.log(results);
            callback();
        });
    });
}

//find doc 
const findDocument = (db, criteria, callback) => {
    let cursor = db.collection('book').find(criteria);
    console.log(`findDocument: ${JSON.stringify(criteria)}`);
    cursor.toArray((err, docs)=>{
        assert.equal(err, null);
        console.log(`findDocument: ${docs.length}`);
        callback(docs);
    });
}
//delete book
const deleteDocument = (db, criteria, callback) => {
    db.collection('book').deleteOne(
       criteria, 
       (err, results) => {
          assert.equal(err, null);
          console.log(results);
          callback();
       }
    );
};

//first page
app.get('/',(req,res) => {
	if(!req.session.authenticated){
		res.redirect("/login");
	}
})

//admin
app.get('/adminpage', (req,res) => {
    if(!req.session.authenticated){
        res.redirect("/admin");
    }
    const client = new MongoClient(mongourl);
    client.connect((err)=>{
        assert.equal(null, err);
        console.log("Connected successfully to the DB server.");
        const db = client.db(dbName);
        //callback()
        findDocument(db, {}, (docs)=>{
            client.close();
            console.log("Closed DB connection.");
            res.status(200).render('admin.ejs', {name: `${req.session.userid}`, ninventory: docs.length, inventory: docs});
        });
    });
});
app.get('/admin', (req,res) => {
    if(req.session.authenticated && req.session.type == "admin"){
        res.status(200).redirect("/adminpage")
    }
    res.status(200).render("adminLogin.ejs");

    
});
app.post('/admin', (req,res) => {
    Admins.forEach((admin) => {
		if (admin.name == req.fields.username && admin.password == req.fields.password) {
        req.session.authenticated = true;
        req.session.userid = req.fields.username;
        req.session.type = "admin";
        console.log(req.session.userid);
        res.status(200).redirect("/adminpage");
        }
    });
});
//admin delete
app.get('/delete', (req, res)=>{
    if(req.session.userid == req.query.owner && req.session.type == "admin"){
        console.log("...hello owner of the document");
        const client = new MongoClient(mongourl);
        client.connect((err) => {
            console.log("Connected successfully to server");
            const db = client.db(dbName);
    
            let DOCID = {};
            DOCID['_id'] = ObjectID(req.query._id);
            DOCID['owner'] = req.query.owner;
            deleteDocument(db, DOCID, (results)=>{
                client.close();
                console.log("Closed DB connection");
                res.status(200).render('alert', {message: "Document successfully deleted."});
            })     
        });
    }else{
        res.status(200).render('alert', {message: "Access denied - You don't have the access right!"}); 
    }
});
//Admin update book


//login methods
app.get('/login', (req,res) => {
    res.status(200).render("login.ejs");
});
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
});

//logout
app.get('/logout', (req, res)=>{
    req.session = null;
    req.authenticated = false;
    res.redirect('/');
});
//home page
app.get('/home', (req,res) => {
    res.status(200).render("home.ejs");
});

//Admin create page
app.get('/create', (req, res)=>{
    res.status(200).render("create.ejs");
});
app.post('/create', (req, res)=>{

    console.log("...create a new document!");
    const client = new MongoClient(mongourl);

    client.connect((err)=>{
        assert.equal(null, err);
        console.log("Connected successfully to the DB server.");
        const db = client.db(dbName);

        //add data from the table
        DOC['BookName']= req.fields.Bookname;
        DOC['Author']= req.fields.Author;
        DOC['Description']= req.fields.description;
        DOC['owner']= `${req.session.userid}`;

        var pdoc = {};
        if (req.files.photo && req.files.photo.size > 0) {
            fs.readFile(req.files.photo.path, (err, data) => {
                assert.equal(err,null);
                pdoc['data'] = new Buffer.from(data).toString('base64');
                pdoc['mimetype'] = req.files.photo.type;        
            });
        } 
        DOC['photo'] = pdoc;
        if(DOC.BookName &&  DOC.owner){
            console.log("...Creating the document");
            createDocument(db, DOC, (docs)=>{
                client.close();
                console.log("Closed DB connection");
                res.status(200).render('alert.ejs', {message: "Document created successfully!"});
            });
        } else{
            client.close();
            console.log("Closed DB connection");
            res.status(200).render('alert.ejs', {message: "Invalid entry - Name & Owner is compulsory!"});
        }
    });
});


app.listen(process.env.PORT || 8099);