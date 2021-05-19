var peer = null;
var peerId = null;
var targetPeerId = null;
var conn = null;
var state = '';

// 1. create peer 
peer = new Peer({
    path: "/peerjs",
    host: "/",
    port: "9000",
    debug: 2
});

// 2. peerServer events
peer.on('open', function (id) {
    peerId = id
    state = 'open to peerServer'
});

peer.on('disconnected', function () {
    alert('disconnected from peerServer')
});

peer.on('error', function (err) {
    alert(err)
});

// 3. dataConnection
// incoming new data connection is established from a remote peer
peer.on('connection', function (connection) {
    conn = connection;
    state = `connection from a remote peer ${conn.peer}`
    listen();
});

// outcoming Connects to the remote peer.
function connect(receiverPeerId) {
    if (conn) {
        conn.close();
        alert('some connect is close')
    }
    conn = peer.connect(receiverPeerId, {
        reliable: true
    });
    state = `connected to remote peer ${receiverPeerId}`
    listen();
}

function listen() {
    conn.on('open', function () {
        console.log(`connection is open from ${conn.peer}`);

        conn.on('data', function (data) {
            alert(`receive data [${data}] from ${conn.peer}`);
        })
    })
    conn.on('close', function () {
        console.log('close dataConnection')
    })
    conn.on('error', function (err) {
        alert(err)
    })
}

// controls 
var id = document.getElementById("id");
var listOfPeers = document.getElementById("peers");
var chat = document.getElementById("chat");
var sendButton = document.getElementById('send');

sendButton.addEventListener('click', () => {
    conn.send(chat.value);
});

// render 
setInterval(() => {
    getListOfPeers()
}, 1000)

function getListOfPeers() {
    fetch('http://localhost:9000/peerjs/keyid:/peers')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            render(data)
        });
}

function render(data) {
    let peers = ''

    data.forEach(peer => {
        if (peerId != peer) {
            peers = peers + `<tr><th width="30%"><div class="${peer}">${peer}</div></th></tr>`
        }
    });

    listOfPeers.innerHTML = `<table width="100%" border="1">
                                <thead>
                                    <tr><th width="30%"><div>List of peers</div></th></tr>
                                    ${peers}
                                </thead>
                             </table>`

    data.forEach(peer => {
        if (peerId != peer) {
            document.getElementsByClassName(`${peer}`)[0].addEventListener('click', function (event) {
                targetPeerId = peer
                connect(targetPeerId)
            })
        }
    })

    id.innerHTML = `ID: ${peerId} </br> STATE: ${state}`
}