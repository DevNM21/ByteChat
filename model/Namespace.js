const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;

// const ObjectId = .Schema

const messageSchema = new mongoose.Schema({
    text : String,
    time : Date,
    username : String,
    avatar : String
})

const roomSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    history : [messageSchema]
})


const namesSpaceSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true
    },
    users : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    endpoint : {
        type : String,
        required : 'true',
        unique : true
    },
    joinCode : String,
    rooms : [roomSchema]
})

namesSpaceSchema.methods.newMessage = async(roomName, messageObject) => {
    const namespace = this
    const room = namespace.rooms.find(r => r.name === roomName)
    room.history.push(messageObject)
    await namespace.save()

} 

namesSpaceSchema.methods.newRoom = async(id,name) => {
    // this function needs to work without getting the id . (saves only  one line though)
    const namespace = await Namespace.findById(id)
    const roomNames = namespace.rooms.map(n => n.name)
    if(roomNames.includes(name)) throw new Error('RoomName exists')

    namespace.rooms.push({name})
    await namespace.save()

}

namesSpaceSchema.statics.findByUserId = async(userId) => {
    const namespaces = await Namespace.find({ users : {"$in" : [ObjectId(userId)] }})
    return namespaces

}

const Namespace = new mongoose.model('Namespace', namesSpaceSchema)
// const s = new Namespace({
//     id : 21,
//     name : 'Dev',
//     endpoint : '/dev'
// }).save()

    
// class Namespace {
//     constructor(id, nsTItle, img, endpoint) {
//         this.id = id
//         this.nsTItle = nsTItle
//         this.img = img
//         this.endpoint = endpoint
//         this.rooms = []
//     }

//     addRoom(roomObj) {
//         this.rooms.push(roomObj)
//     }
// }

module.exports = Namespace