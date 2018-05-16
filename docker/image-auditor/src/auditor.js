let protocol = require("./protocol");
let dgram = require("dgram");
let net = require('net');

//On crée une map pour stocker les musiciens actifs
let musicians = new Map(); 

function createJSONFromMSg(message){
    json = JSON.parse(message);
    console.log("(" + json.id + ") " + json.soundPlayed);
    let instrument;

    switch(json.soundPlayed){
        case protocol.PIANO_SOUND:
            instrument = "piano";
            break;
        case protocol.TRUMPET_SOUND:
            instrument = "trumpet";
            break;
        case protocol.FLUTE_SOUND:
            instrument = "flute";
            break;
        case protocol.VIOLIN_SOUND:
            instrument = "violin";
            break;
        case protocol.DRUM_SOUND:
            instrument = "drum";
            break;
        default:
            instrument= "not a musician";
    }

    if(!musicians.has(json.id)){
        console.log("un musicien est ajouté!")
        musicians.set(json.id, {
            uuid: json.id,
            instrument: instrument,
            activeSince: Date.now(),
            lastSeen: Date.now()
        })
    } else {
        let musician = musicians.get(json.id);
        musician.lastSeen = Date.now();
    }
}


//On crée une socket qui écoute les musiciens qui émettent sur le port protocol.PORT
let socket = dgram.createSocket('udp4');
socket.bind(protocol.PORT, function(){
    console.log("rejoint le groupe multicast");
    socket.addMembership(protocol.MULTICAST_ADDRESS);
});

//appelée sur chaque message reçu depuis un broadcast
socket.on('message', function(msg, source){
    createJSONFromMSg(msg);
});

function newSocket(socket){
    let arrayMusicians = [];

    for(let key of musicians.keys()){
        //si un musicien n'a plus joué depuis plus de 5 secondes, il est supprimé de la liste
        if(Date.now() - musicians.get(key).lastSeen > 5000){
            musicians.delete(key);
        } else {
            arrayMusicians.push(
                {
                    uuid: musicians.get(key).id,
                    instrument: musicians.get(key).instrument,
                    activeSince: new Date(musicians.get(key).activeSince)
                }
            );
        }
    }

    socket.write(JSON.stringify(arrayMusicians)+ "\r\n");

    socket.end();
}

//On crée un nouveau serveur et on fourni un callback quand un connexion est établie
let server = net.createServer(newSocket);

//on écoute le port
server.listen(2205);

