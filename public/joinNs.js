var messageIds = []

function formSubmission(e){
    e.preventDefault()
    const newMessage  = document.querySelector('#user-message')    
    nsSocket.emit('newMessageToServer', {text :newMessage.value })
    newMessage.value = ""

}

function joinNs(endpoint) {
    console.log('endpoint',endpoint);
    
    if(nsSocket) {
        nsSocket.close()
        console.log('socket closed');
        
        document.querySelector('#user-input').removeEventListener('submit', formSubmission)
    }
    
    nsSocket = io(`http://localhost:8080${endpoint}`, {
        query : {
            username
        }})
    nsSocket.on('nsRoomLoad',(nsRooms)=>{
        console.log('rooms loading');
        
        // console.log(nsRooms)
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = "";
        nsRooms.forEach((room)=>{
            let glyph;
            if(room.privateRoom){
                glyph = 'lock'
            }else{
                glyph = 'globe'
            }
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.name}</li>`
            console.log(room);
            
        })
        roomList.innerHTML += `<div><input type="text" id="newRoom" placeholder="New Room"> <button style="display : grid" onclick="addRoom()"> + </button> </div>`
        // add click listener to each room
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem)=>{
            elem.addEventListener('click',(e)=>{
                // joinRoom(e.target.innerText)
                alert(e.target.innerText)
                joinRoom(e.target.innerText)
            })
        })
        const topRoomName = document.querySelector('.room').innerText
        joinRoom(topRoomName)
        
    })

document.querySelector('#user-input').addEventListener('submit',formSubmission)




nsSocket.on('messageToClients', msg=>{
    const newMsg = buildHTML(msg)
    document.querySelector('#messages').innerHTML += newMsg
})

nsSocket.on('alertError', errMsg => {
    Swal.fire({
        icon: 'error',
        title: errMsg
      })
    
})


 }
function buildHTML(msg) {
    const convertedDate = new Date(msg.time).toLocaleString()
    const newHTML = `
    <li>
    <div class="user-image">
        <img height='50px' width='50px' src="${msg.avatar}" />
    </div>
    <div class="user-message">
<div class="user-name-time">${msg.username}<span>${convertedDate}</span></div>
        <div class="message-text">${msg.text}</div>
    </div>
</li>
`
return newHTML
}

function addRoom() {
    let roomName = document.getElementById('newRoom').value
    if(roomName === '')  { 
        alert("Roomname can't be empty") 
    }
    else {
        nsSocket.emit('newRoom', roomName)
    }
}