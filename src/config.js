const mongoose = require('mongoose');
const { type } = require('os');
const connect = mongoose.connect('mongodb://localhost:27017/Login-tut');

//check database connected or not
connect.then(() => {
    console.log(`Database connected successfully`);
})
.catch(() => {
    console.log(`Database can not be created`);
})


// create a schema
const LogInSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
});


// collection part
const collection = new mongoose.model('users', LogInSchema);

module.exports = collection;