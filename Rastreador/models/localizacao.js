// CARREGA BIBLIOTECAS PARA ACESSO AO MONGODB
const mongoose = require('mongoose')
require('../db/mongoose')

mongoose.models = {}

// ESQUEMA PARA LOCALIZACAO NO MONGODB
const Localizacao = mongoose.model('Localizacao',{
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
    dataDoGPS: {
        type: Date,
        required: true
    },
    direcao: {
        type: Number,
        required: true,
        default: false
    },
    distancia: {
        type: Number,
        required: true,
        default: false
    },
    dataDoEquipamento: {
        type: Number,
        required: true,
        default: false
    },
    GPSFixado: {
        type: Boolean,
        required: true,
        default: false
    },
    GPSHistorico: {
        type: Boolean,
        required: true,
        default: false
    },
    IgnicaoLigada: {
        type: Boolean,
        required: true,
        default: false
    },
    LatitudeNegativa: {
        type: Boolean,
        required: true,
        default: false
    },
    LongitudeNegativa: {
        type: Boolean,
        required: true,
        default: false
    },
    ComposicaoDeValores: {
        type: Number,
        required: true,
        default: false
    },
    VelocidadeAtual: {
        type: Number,
        required: true,
        default: false
    },
    Latitude: {
        type: Number,
        required: true,
        default: false
    },
    Longitude: {
        type: Number,
        required: true,
        default: false
    },
})

// FUNCAO QUE SALVA OS DADOS DO BUFFER TCP DA LOCALIZACAO
function saveLocalizacao(buffer) {

    var now = new Date();

    var date = new Date(0); 
    date.setUTCSeconds(parseInt(buffer.substring(12,20), 16));

    composicao = parseInt(buffer.substring(40,42),16).toString(2);

    for (i = 0; i < 5; i++) {
        if ( (composicao.substring(i,i+1)) && (i == 0) )
        {
            gpsfixado = true

        }
        else
        {
            gpsfixado = false
        }
        if ( (composicao.substring(i,i+1)) && (i == 1) )
        {
            gpshistorico = true

        }
        else
        {
            gpshistorico = false
        }
        if ( (composicao.substring(i,i+1)) && (i == 2) )
        {
            ignicaoligada = true

        }
        else
        {
            ignicaoligada = false
        }
        if ( (composicao.substring(i,i+1)) && (i == 3) )
        {
            latitudenegativa = true

        }
        else
        {
            latitudenegativa = false
        }
        if ( (composicao.substring(i,i+1)) && (i == 4) )
        {
            longitudenegativa = true

        }
        else
        {
            longitudenegativa = false
        }
    }

    dados =  {
        timeStamp: now,
        deviceID: buffer.substring(4,10),
        dataDoGPS: date,
        direcao: parseInt(buffer.substring(20,24), 16),
        distancia: parseInt(buffer.substring(24,32), 16),
        dataDoEquipamento: parseInt(buffer.substring(32,40), 16),
        GPSFixado: gpsfixado,
        GPSHistorico: gpshistorico,
        IgnicaoLigada: ignicaoligada,
        LatitudeNegativa: latitudenegativa,
        LongitudeNegativa: longitudenegativa,
        ComposicaoDeValores: parseInt(buffer.substring(40,42), 16),
        VelocidadeAtual: parseInt(buffer.substring(42,44), 16),
        Latitude: parseFloat(buffer.substring(44,52),16).toFixed(6),
        Longitude: parseFloat(buffer.substring(52,60),16).toFixed(6),
    }

    const localizacao = new Localizacao(dados)
    localizacao.save()

}

module.exports = { saveLocalizacao, Localizacao }