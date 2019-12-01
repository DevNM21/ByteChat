const io = require('../server').io
const Namespace = require('../model/Namespace')
const User = require('../model/User')
const randomize = require('randomatic');
var username;
var user;


var namespaces;

const run = async () => {
    
    // console.log(0, namespaces);
    namespaces.forEach(namespace => {
    
        io.of(namespace.endpoint).on('connection', async (suckIT)=> {
            console.log(`${suckIT.id} has joined ${namespace.endpoint}`);
            const username =  suckIT.handshake.query.username;
            var rooms = namespaces.find(e=> e.endpoint === namespace.endpoint).rooms
            // console.log('rooms', rooms);
            if(!rooms)suckIT.emit('nsRoomLoad', [])
            
            suckIT.emit('nsRoomLoad', rooms)
            const roomTitle = Object.keys(suckIT.rooms)[1]
            suckIT.leave(roomTitle)
            updateUsersInRoom(namespace, roomTitle)
            suckIT.on('joinRoom', (roomToJoin)=>{
                
                suckIT.join(roomToJoin)
                console.log('room joined ?');
                
               
                const nsRoom = rooms.find(room => room.name === roomToJoin)
                if(!nsRoom || nsRoom.length === 0){
                    updateUsersInRoom(namespace, roomToJoin);
                }
                else if(nsRoom.history) {
                    suckIT.emit('history', nsRoom.history)
                    updateUsersInRoom(namespace, roomToJoin);
                }
                
            })
        suckIT.on('newMessageToServer', async(msg)=> {
            
            const fullMsg = {
                text : msg.text,
                time : Date.now(),
                username : username,
                avatar : `https://robohash.org/${username}`
            }
                const roomTitle = Object.keys(suckIT.rooms)[1]
                console.log('roomTItile',roomTitle);
                
                 namespace.rooms.forEach(r =>{ 
                    if (r.name === roomTitle) {
                        r.history.push(fullMsg)
                    }
                })
                 namespace.save()
                io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
                
        })

        suckIT.on('newRoom',async roomName => {
        try {
            await namespace.newRoom(namespace._id,roomName)
            namespaces = await Namespace.find()
            var rooms = namespaces.find(e=> e.endpoint === namespace.endpoint).rooms
            
            suckIT.emit('nsRoomLoad', rooms)
        } catch (error) {
            suckIT.emit('alertError', error.toString())
        }            
            
            
        })
        })
    }) 
    
    
}

const emitNsData = async(socket, userId) => {
    namespaces = await Namespace.findByUserId(userId)    
        let nsData = namespaces.map(ns=> {
            return {
                name : ns.name,
                img : ns.img,
                endpoint : ns.endpoint
            }
        })
        socket.emit('nsData', nsData)

    
}

io.sockets.on('connect', async(socket) => {
    username =  socket.handshake.query.username;
    user = await User.findOne({username})    
    namespaces = await Namespace.findByUserId(user._id)
    run()

    

    console.log('connected');
    await emitNsData(socket, user._id)
    // socket.on('newRoom', roomName => {
    //     console.log(roomName);
        
    // })
    socket.on('newNs', async(data) => {
        const user = await User.findOne({username : data.username})
        
        let users = [user._id]
        console.log('sdwadw',users);
        
        await new Namespace({
            name : data.name,
            users: users,
            endpoint : '/' + data.name,
            joinCode : randomize('Aa0', 6)
        }).save()
    run()
    await emitNsData(socket, user._id)        
    socket.emit('nsRoomLoad', [])
    })
})



function updateUsersInRoom(namespace,roomToJoin) {
    io.of(namespace.endpoint).in(roomToJoin).clients((err, clients)=> {
        io.of(namespace.endpoint).in(roomToJoin).emit('updateMemberNumber', clients.length)
    })
} 

module.exports = io
