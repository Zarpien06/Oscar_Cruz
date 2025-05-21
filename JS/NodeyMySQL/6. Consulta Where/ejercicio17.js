/* Se usa la libreria mysql para seleccionar todos los registros
    de la tabla customers de forma ascendente en la base de datos mydb */
    
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});

con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM customers ORDER BY name", function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});