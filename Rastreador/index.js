
//CARREGA BIBLIOTECAS
var net = require('net'); //CARREGA A BIBLIOTECA PARA COMUNICACAO TCP/IP       
const saveHeartBeat = require('./models/heartbeat') //CARREGA A FUNCAO QUE SALVA O HEARTBEAT NO MONGODB
const { saveLocalizacao, Localizacao } = require('./models/localizacao') // CARREGA A FUNCAO QUE SALVA A LOCALIZACAO NO MONGODB E SEU ESQUEMA
const express = require('express') // CARREGA A BIBLIOTECA RESTFUL API

var portNumber = 8080; // DEFINE A PORTA TCP DO SERVIDOR DE PACOTES TCP          
var hostName = '127.0.0.1';    
var httpport = 3000; // DEFINE A PORTA PARA A COMUNICACAO VIA HTTP

var server = net.createServer(); // INICIA O SERVIDOR TCP
const app = express() // INICIA O SERVIDOR RESTFUL API HTTP

app.use(express.json()) // DEFINE QUE O SERVIDOR RESTFUL API SE COMUNIQUE POR JSON

// COLOCA O SERVIDOR TCP OUVINDO A PORTA TCP
server.listen({
	host: hostName,
	port: portNumber,
	exclusive: true
});

// PERMITE MULTIPLAS CONEXOES
let sockets = [];

// FUNCAO QUE CONTROLA CONEXOES NO SERVIDOR TCP
// ELA TEM UM CALLBACK QUE RETORNA UM SOCKET (UMA CONEXAO)
server.on('connection', function(sock) {
	
	console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
	
	sockets.push(sock);

	// FUNCAO QUE CONTROLA O QUE OCORRE QUANDO UM PACOTE É RECEBIDO
	// ELA TEM UMA CALLBACK QUE RETORNA UM DADO (DATA)
    sock.on('data', function(data) {
	   
		dados = data.toString()


		// AS LINHAS ABAIXO VERIFICAM SE O PACOTE É DO TIPO 1 (PING/HEARTBEAT) OU DO TIPO 2 (LOCALIZACAO)
		comando = parseInt(dados.substring(10,12))

		if (comando == 1)
		{

			// SALVA OS DADOS DO PING/HEARTBEAT NO MONGODB
			saveHeartBeat(dados)

			// CASO O PACOTE SEJA UM PING, ESSA FUNCAO RETORNA UM 'ACK' DE VOLTA USANDO O SOCKET
			sock.write(dados + ': ACK')

			console.log(dados + ': ACK');

		}
		if (comando == 2)
		{

			// SALVA OS DADOS DA LOCALIZACAO NO MONGODB
			saveLocalizacao(dados)

			console.log(dados + ': LOCALIZACAO');
		}
		
    });

	
	// FUNCAO QUE ENCERRA AS CONEXOES COM OS SOCKETS
    sock.on('close', function(data) {
	   
		let index = sockets.findIndex(function(o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
		if (index !== -1) sockets.splice(index, 1);
		
		console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
		
    });
});

// FUNCAO HTTP RESTFUL API GET
app.get('/api/v1/location/:_device_id',(req,res) => {
    
    const _device_id = req.params._device_id

	// USA O ESQUEMA DA LOCALIZACAO, CONSULTA O BANCO BUSCANDO O ULTIMO REGISTRO COM O DEVICE_ID
	// RETORNA APENAS A LATITUDE E LONGITUDE
	Localizacao.find({deviceID:_device_id}).lean().limit(1).exec((err, local) => {
		const obj = JSON.parse(JSON.stringify(local))
		const info = obj[0]
		var lat = info['Latitude']
		var long = info['Longitude']
		var latNeg = info['LatitudeNegativa']
		var longNeg = info['LongitudeNegativa']

		if (latNeg)
		{
			lat = -1 * lat
		}

		if (longNeg)
		{
			long = -1 * long
		}

		res.send('LATITUDE:' + lat + ',' + 'LONGITUDE:' + long)
	})

})

// COLOCA O HTTP RESTFUL API SERVER OUVINDO NUMA PORTA TCP ESPECIFICA
app.listen(httpport,() => {
    console.log('Server is running on port ' + httpport)
})

