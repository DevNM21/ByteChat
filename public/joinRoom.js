function joinRoom(roomName){
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span> `
    })

    nsSocket.on('history', history=> {
        
        const messagesUI = document.querySelector('#messages')
        messagesUI.innerHTML = "";
        history.forEach(msg => {

        messagesUI.innerHTML += buildHTML(msg)
        })        
        messagesUI.scrollTo(0, messagesUI.scrollHeight)
    })
    nsSocket.on('updateMemberNumber', newNumber =>{
        document.querySelector('.curr-room-text').innerText = roomName
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumber} <span class="glyphicon glyphicon-user"></span> `

    }) 
}