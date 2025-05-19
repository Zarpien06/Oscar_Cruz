// Ejercicio 1
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(8080);

// Ejercicio 2
exports.myDateTime = function () {
    return Date();
}

// Ejercicio 3
var http = require('http');
var dt = require('./ejercicio1');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('La fecha y tiempo es: ' + dt.myDateTime());
    res.end();
}).listen(8080);

//http servidor
// http es un modulo de node que nos permite crear un servidor http que se ejecutara en el puerto 8080 y nos conecta a internet 

// Url http://localhost:8080
// url es la direccion de la pagina web que se conecta con el servidor http 
