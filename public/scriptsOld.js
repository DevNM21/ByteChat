document.querySelector('#send').addEventListener('click', (event) => {
        
    var newMessage = document.querySelector('#user-message').value
    socket.emit('new-message-to-server', {text : newMessage})
    
})

const socket = io('http://localhost:9000');

socket.on('messageFromServer', (data)=>{
    console.log(data);
    socket.emit('dataToServer', {data : 'dataFrom the client'})
})

socket.on('message-to-clients', data=> {
    document.querySelector('#messages').innerHTML += `<li> ${data.text} </li>`
})
