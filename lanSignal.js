var serialport = require('serialport');
var http = require('http');
var dispatcher = require('httpdispatcher');
var querystring = require('querystring');
var chalk = require('chalk');

const port = 3001;
const host = '0.0.0.0';
const target = '127.0.0.1'; //zielcomputer

SerialPort = serialport.SerialPort;
arduinoPort = process.argv[2];
var portOpen = false;

var answered = true;
var steps = 4000;

if (process.argv[2] == "-l") {
  serialport.list(function(err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
      console.log(port.pnpId);
      console.log(port.manufacturer);
    });
  });
}

//open port
try {
  var myPort = new SerialPort(arduinoPort, {
    baudrate: 9600
  });
  parser: serialport.parsers.raw //rohdatenparser definieren
  portOpen = true;
} catch (err) {
  console.log("Nicht mit Arduino verbunden");
  portOpen = false;
}



var sendRequest = function() {
  var postData = querystring.stringify({
    'msg': 'Hello World!'
  });

  var options = {
    hostname: target,
    port: port,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
      answered = true;
    })
  });

  req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();

}

//implementation of abstract port functions
if (portOpen) {
  myPort.on('open', showPortOpen);
  myPort.on('data', sendSerialData);
  myPort.on('close', showPortClose);
  myPort.on('error', showError);

  function showPortOpen() {
    console.log('port open. Data rate: ' + myPort.options.baudRate);
  }

  function sendSerialData(data) {
    console.log(chalk.blue("Knopf gedrückt"));
    if(answered) {
      !answered;
    sendRequest();
  }

  }

  function showPortClose() {
    console.log('port closed.');
  }

  function showError(error) {
    console.log('Serial port error: ' + error);
  }
}

//http dispatcher callback-funktion
var handleRequest = function(req, res) {
  //dispatcher einrichten
  try {
    console.log(req.url);
    dispatcher.dispatch(req, res);
  } catch (err) {
    console.log(err);
  }
  //relativen ressourcenpfad setzen
  dispatcher.setStatic('resources');
  dispatcher.setStaticDirname('/');

  dispatcher.onPost("/", function(req, res) {
    //signal an arduino schicken
    var signal = new Buffer(steps);

    myPort.write(signal, function(err, result) {
      if (err != null) console.log(err);
      if (result != null) console.log(result);
    });
    res.writeHead(200, {
      'Content-type': 'text/HTML'
    });
    res.end();
  });
}

var server = http.createServer(handleRequest);
server.listen(port, host);
