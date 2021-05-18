var peer = null;
var user = 'user' // prompt('enter name:');

var listOfPeers = document.getElementById("ListOfPeers");
var connectButton = document.getElementById('connect');
var recvIdInput = document.getElementById("receiver-id");

connectButton.addEventListener('click', () => {
    console.log('Create the connection')
});

function init() {
    peer = new Peer({
        path: "/peerjs",
        host: "/",
        port: "9000",
        debug: 2
    });
};

// refresh listOfPeers
setInterval(() => {
    getListOfPeers()
}, 3000)

function getListOfPeers() {
    fetch('http://localhost:9000/peerjs/keyid:/peers')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            reload(data)
        });
}

function reload(data) {

    let peers = ''
    data.forEach(peer => {
        peers = peers + `<tr><th width="30%"><div class="${peer}">${peer}</div></th></tr>`
    });

    ListOfPeers.innerHTML = `<table width="100%" border="1">
                                    <thead>
                                        ${peers}
                                    </thead>
                                 </table>`

    data.forEach(peer => {
        document.getElementsByClassName(`${peer}`)[0].addEventListener('click', function (event) {
            recvIdInput.value = peer
        });
    });
}

init();