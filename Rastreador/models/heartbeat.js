// CARREGA BIBLIOTECAS PARA ACESSO AO MONGODB
const mongoose = require('mongoose')
require('../db/mongoose')

mongoose.models = {}

// ESQUEMA PARA PING/HEARTBEAT NO MONGODB
const HeartBeat = mongoose.model('HearBeat',{
    timeStamp: {
        type: Date,
        required: true
    },
    deviceID: {
        type: String,
        trim: true,
        required: true,
        default: false
    },
    dados: {
        type: String,
        trim: true,
        required: true,
        default: false
    }
})

// FUNCAO QUE SALVA OS DADOS DO BUFFER TCP DO PING/HEARTBEAT
function saveHeartBeat(buffer) {

    var now = new Date();

    dados =  {
        timeStamp: now,
        deviceID: buffer.substring(4,10),
        dados: buffer.substring(12,20)
    }


    const heart = new HeartBeat(dados)
    heart.save()

}

module.exports = saveHeartBeat