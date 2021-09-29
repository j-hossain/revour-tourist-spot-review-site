
const mysql = require('mysql');

//db connecting
const connection = mysql.createConnection({
    host: process.env.DT_HOST,
    user: process.env.DT_USER,
    password: process.env.DT_PASS,
    database: process.env.DT_BASE
});

connection.connect(function(e){
    if(e){
        console.log("error connecting " + e);
        return;
    }
    else{
        console.log("connected as id: "+ connection.threadId);
    }
});

module.exports = connection;