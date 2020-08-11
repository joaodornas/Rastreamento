// CARREGA BIBLIOTECAS PARA ACESSO AO MONGODB
const mongoose = require('mongoose')

// DEFINE PARAMETROS PARA ACESSO AO BANCO MONGODB
mongoose.connect('mongodb://127.0.0.1:27017/rastro', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
