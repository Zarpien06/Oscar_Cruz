/* Se usa la libreria mysql para seleccionar todos los registros
    de la tabla customers en la base de datos mydb */

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});

var adr = 'Mountain 21';
var sql = 'SELECT * FROM customers WHERE address = ?';
con.query(sql, [adr], function (err, result) {
    if (err) throw err;
    console.log(result);
});