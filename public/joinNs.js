function formSubmission(e){
    e.preventDefault()
    const newMessage  = document.querySelector('#user-message').value
    console.log(2);
    
    nsSocket.emit('newMessageToServer', {text :newMessage })
}

function joinNs(endpoint) {
    if(nsSocket) {
        nsSocket.close()
        document.querySelector('#user-input').removeEventListener('submit', formSubmission)
    }
    
    nsSocket = io(`http://localhost:9000${endpoint}`)
    nsSocket.on('nsRoomLoad',(nsRooms)=>{
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
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`
            console.log(room);
            
        })
        // add click listener to each room
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem)=>{
            elem.addEventListener('click',(e)=>{
                // joinRoom(e.target.innerText)
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

 }
function buildHTML(msg) {
    const convertedDate = new Date(msg.time).toLocaleString()
    const newHTML = `
    <li>
    <div class="user-image">
        <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
<div class="user-name-time">${msg.username}<span>${convertedDate}</span></div>
        <div class="message-text">${msg.text.text}</div>
    </div>
</li>
`
return newHTML
}