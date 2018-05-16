let protocol = require('./protocol');

//il faut prendre uuid v4 parce que uuid c'est pas bien
const uuid = require('uuid/v4');

//on utilise ce module pour pouvoir utiliser UDP
let dgram = require('dgram');

console.log("Hello");

//on crée la variable instrument qui vaut le 1er argument passé quand on run la class
let instrument = process.argv[2];

let sound;

//on détermine le son que le musicien va jouer
switch(instrument){
    case "piano":
    sound = protocol.PIANO_SOUND;
        break;
    case "trumpet":
    sound = protocol.TRUMPET_SOUND;
        break;
    case "flute":
    sound = protocol.FLUTE_SOUND;
        break;
    case "violin":
    sound = protocol.VIOLIN_SOUND;
        break;
    case "drum":
    sound = protocol.DRUM_SOUND;
        break;
    default:
    sound = "not a musician";
}

let musician = {
    soundPlayed: sound,
    id: uuid()
}

//On crée maintenant un datagram socket
var socket = dgram.createSocket('udp4');
//on fait en sorte que la socket envoie en Broadcast
socket.bind(0, '', function(){
    socket.setBroadcast(true);
});

let payload = JSON.stringify(musician);

//met le payload dans un buffer pour pouvoir l'envoyer
message = new Buffer(payload);

//on set l'intervalle d'envoie du message à toutes les secondes
setInterval(
    function(){
        console.log("envoi du JSON musician");
        //à décommenter pour afficher le son joué par le musicien
        //console.log(payload);
        socket.send(message, 0, message.length, protocol.PORT, protocol.MULTICAST_ADDRESS,
        function(err, bytes){
                
        });
        //temps entre chaque envoi en millisecondes
    }, 1000
);