require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
// const { Server } = require("socket.io");
const { Deepgram } = require('@deepgram/sdk')

const deepgram = new Deepgram(process.env.API_KEY_DEEPGRAM)
const server = http.createServer(app);
const pathToFile = '/prueba.ogg'
// const io = new Server(server);


const deepgramSocket = deepgram.transcription.live({
    language: 'es',
    punctuate: true
})


deepgramSocket.addListener('open', () => {

    console.log('Conexión establecida!')

    const fs = require('fs')
    const contents = fs.readFileSync(__dirname + pathToFile)

    const chunk_size = 1000
    for (i = 0; i < contents.length; i += chunk_size) {
        const slice = contents.slice(i, i + chunk_size)
        deepgramSocket.send(slice)
    }

    deepgramSocket.finish()
})

deepgramSocket.addListener('close', () => {
    console.log('Conexión cerrada')
})

deepgramSocket.addListener('transcriptReceived', (transcription) => {

    const transcriptionParsed = JSON.parse(transcription)
    if(!transcriptionParsed.transaction_key) {
        console.log(transcriptionParsed.channel.alternatives[0].transcript)
    }
    
})

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });


// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('chat message', (msg) => {
//         console.log('the message: ', msg)
//         setTimeout(() => {
//             io.emit('chat message', msg)
//         }, 2000)
//     })
//     socket.on('disconnect', () => {
//         console.log('user disconnected')
//     })
// });

server.listen(3000, () => {
    console.log('listening on *:3000');
});