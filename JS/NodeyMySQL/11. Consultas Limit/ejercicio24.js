/* Se usa la libreria mysql para seleccionar los primeros 5 registros y luego saltar 2
    de la tabla customers en la base de datos mydb */

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});

con.connect(function (err) {
    if (err) throw err;
    var sql = "SELECT * FROM customers LIMIT 5 OFFSET 2";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});