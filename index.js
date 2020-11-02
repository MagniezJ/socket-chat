var app = require('express')();
const express=require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function (socket, pseudo) {
    
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function(pseudo) {
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });
    socket.on('typing', (data)=>{
        socket.broadcast.emit('display', data);})

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
        console.log(socket.pseudo+":"+message)
    }); 
});

http.listen(3000, () => {})