/* Se usa la libreria mysql para borrar todos los registros
    de la tabla customers para eliminar la tabla de la base de datos mydb */

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
});

con.connect(function (err) {
    if (err) throw err;
    var sql = "DROP TABLE customers";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table deleted");
    });
});