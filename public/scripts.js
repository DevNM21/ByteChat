var username = document.getElementById('username').value
var socket = io.connect('http://localhost:8080', {
    query : {
        username
    }
});

socket.on('alertError', errMsg => {
    swal(errMsg)
})

var nsSocket = "";


socket.on('nsData', data=> {
    let namespacesDiv = document.querySelector('.namespaces')
    namespacesDiv.innerHTML = " <h3>Spaces</h3>"
    data.forEach(namespace => {
        namespacesDiv.innerHTML += `<div class='namespace' ns='${namespace.endpoint}' > <h6> ${namespace.name} </h6></div>`
    });
    namespacesDiv.innerHTML += `<div><input type="text" id="newNs" placeholder="New Space"> <button style="display : grid" onclick="addNs()"> + </button> </div>`
    var namespacesHC = document.getElementsByClassName('namespace')
    var namespaces = [].slice.call(namespacesHC);
    namespaces.forEach(ns => {
        ns.addEventListener('click', e=> {
            const nsEndpoint = ns.getAttribute('ns')
            console.log('to koin',nsEndpoint);
            joinNs(nsEndpoint)
        })        
    })
 
})

const addNs = function () {
    const newNs = document.getElementById('newNs').value
    socket.emit('newNs', {name : newNs, username})
}
