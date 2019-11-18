var username = prompt("Enter an username")
var socket = io('https://4e3040fa.ngrok.io', {
    query : {
        username
    }
});
var nsSocket = "";


socket.on('nsData', data=> {
    // console.log(data);
    let namespacesDiv = document.querySelector('.namespaces')
    namespacesDiv.innerHTML = ""
    data.forEach(namespace => {
        namespacesDiv.innerHTML += `<div class='namespace' ns='${namespace.endpoint}' > <img src=${namespace.img} /></div>`
    });

    var namespacesHC = document.getElementsByClassName('namespace')
    var namespaces = [].slice.call(namespacesHC);
    namespaces.forEach(ns => {
        ns.addEventListener('click', e=> {
            const nsEndpoint = ns.getAttribute('ns')
            console.log(nsEndpoint);
            joinNs(nsEndpoint)
        })        
    })
 
})
