const mysql = require('mysql')
let dbConf = require('../../config/dbConfig.js');

let conn = mysql.createConnection(
    {
        host: dbConf.host,
        user: dbConf.user,
        password: dbConf.password,
        database: dbConf.database
    }  
);

conn.connect( (err) => {
    if (err) {
        console.log('mysql connection failed. Error: ' + err.message);
    }
    else {
        console.log('mysql connection established');
    }
});

module.exports = conn;
