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

// Ejercicio 5

var url = require('url');
var adr = 'http://localhost:8080/default.html?year=2017&month=february';
var q = url.parse(adr);

console.log(q.host); //returns 'localhost:8080'
console.log(q.pathname); //returns '/default.html'
console.log(q.search); //returns '?year=2017&month=february'

var qdata = q.query; //returns an object: { year: 2017, month: 'february' }

console.log(qdata.month); //returns 'february'
