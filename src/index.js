const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const { escape } = require('querystring');


const app = express();
// convert data into json format
app.use(express.json());

app.use(express.urlencoded({extended : false}));

const port = 3000;


const viewPath = path.join(__dirname, '../views');
const publicPath = path.join(__dirname, '../public')

// use EJS as a the view engine
app.set('view engine', 'ejs');
app.set('views', viewPath);

// static files
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});


// Register User
app.post('/signup', async (req, res) => {
    const data = {
        name : req.body.username,
        password : req.body.password
    }


    //check if the user already exists in the database
    const existingUser = await collection.findOne({name : data.name});
    if(existingUser){
        res.send(`User already exists. Please choose a different username.`);
    } else {
        // hash the password using bcrypt
        const saltRounds = 10; // number of salt round for brycpt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;     // replace the hash password with original password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
});


// Login user
app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({name : req.body.username});
        if(!check) {
            res.send(`user name cannot found`);
        }

        // compare the hash password from the database with plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch) {
            res.render('home');
        } else {
            req.send(`wrong password`);
        }
    } catch{
        res.send(`wrong details`);
    }
})



app.listen(port, () => {
    console.log(`server started to run at ${port}`);
});