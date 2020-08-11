
// CARREGA BIBLIOTECA PARA CONEXAO VIA SOCKET TCP
const net = require('net');

// INICIA UM CLIENTE SOCKET TCP
const client = new net.Socket();

// DEFINE PORTA E IP DE CONEXAO
const port = 8080;
const host = '127.0.0.1';

// INICIA CONEXAO SOCKET TCP
client.connect(port, host, function() {
    console.log('Connected');

    delayOne = 2000
    delayTwo = 20000

    // NAS LINHAS ABAIXO SAO DEFINIDAS DUAS FUNCOES, UMA PARA ENVIAR PELO SOCKET O HEXADECIMAL DE EXEMPLO DO HEARTBEAT
    // E O HEXADECIMAL DE EXEMPLO DE LOCALIZACAO
    // AS DUAS FUNCOES SAO DEFINIDAS E SAO EXECUTADAS PERIODICAMENTE DE ACORDO COM DOIS INTERVALOS DIFERENTES

    function sendPING() {
   
        client.write('50F70A3F730150494E4773C4')
   
        console.log('HEARBEAT')

    }

    function sendLocalizacao() {
   
        client.write('50F70A3F73025EFCF950156F017D784000008CA0F80084003C013026A1029E72BD73C4')
   
        console.log('LOCALIZACAO')

    }

    setInterval(sendPING, delayOne)

    setInterval(sendLocalizacao, delayTwo)

});

// FUNCAO QUE DEFINE QUANDO O CLIENTE RECEBE UM DADO DO SERVIDOR
client.on('data', function(data) {
    console.log('Server: ' + data);
});

// FUNCAO QUE ENCERRA A CONEXAO
client.on('close', function() {
    console.log('Connection closed');
});
