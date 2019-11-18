
const express = require('express');
const app = express();
const socketio = require('socket.io')

let namespaces = require('./data/namespace')


app.use(express.static(__dirname + '/public'));
const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', socket => {
    let nsData = namespaces.map(ns=> {
        return {
            img : ns.img,
            endpoint : ns.endpoint
        }
    })
    // console.log(nsData);
    socket.emit('nsData', nsData)
    
})

namespaces.forEach(namespace => {
    
    io.of(namespace.endpoint).on('connection', suckIT=> {
        console.log(`${suckIT.id} has joined ${namespace.endpoint}`);
        const username =  suckIT.handshake.query.username;
        var rooms = namespaces.find(e=> e.endpoint === namespace.endpoint).rooms
        suckIT.emit('nsRoomLoad', rooms)
        const roomTitle = Object.keys(suckIT.rooms)[1]
        suckIT.leave(roomTitle)
        updateUsersInRoom(namespace, roomTitle)
        suckIT.on('joinRoom', (roomToJoin, numberOfUsersCallback)=>{
            // deal with histort
            suckIT.join(roomToJoin)
           
            const nsRoom = rooms.find(room => room.roomTitle === roomToJoin)
            console.log(nsRoom);
            
            suckIT.emit('history', nsRoom.history)
            updateUsersInRoom(namespace, roomToJoin);
        })
    suckIT.on('newMessageToServer', msg=> {
        const fullMsg = {
            text : msg,
            time : Date.now(),
            username : username,
            avatar : "https://via.placeholder.com/30"
        }
            const roomTitle = Object.keys(suckIT.rooms)[1]
            const nsRoom = rooms.find(room => room.roomTitle === roomTitle)
            nsRoom.addMessage(fullMsg)            
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
            
    })
    })
}) 

function updateUsersInRoom(namespace,roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((err, clients)=> {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMemberNumber', clients.length)
    })
} 