const fs = require('fs')
const http = require('http')
const https = require('https')
const username = 'username'
const password = 'password'
const auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64')
var totalCount =0;
var maxCount = 10;
var totalTime = 0;

const host = "i.vimeocdn.com";
const hostPort = 443;
const hostPath = "/video/899768373.webp?mw=1400&mh=788";

const keepAliveAgent = new http.Agent({ keepAlive: true });
//options.agent = keepAliveAgent;
//http.request(options,callback);
function Timing() {
	const timings = {
	    // use new Date() as it's not a subject of clock drift
	    startAt: new Date(),
	    dnsLookupAt: undefined,
	    tcpConnectionAt: undefined,
	    tlsHandshakeAt: undefined,
	    firstByteAt: undefined,
	    endAt: undefined
	  }

  const req = https.request({ 
  
 host: host, port: hostPort, path : hostPath
/*
  host: "www.google.com",
  port: 443,
  method: 'get',
  path: '/'
*/
  //port: hostPort,
  //path: hostPath
  //agent: false

  }, (res) => {
  	let chunks=[];
    res.once('readable', () => {
      timings.firstByteAt = new Date()
    })
    res.on('data', (chunk) => { chunks.push(chunk); })
    res.on('end', () => {
        timings.endAt = new Date()
	var t= (timings.endAt - timings.startAt);
	totalTime += t;
	console.log("");
	console.log("First Byte (ms): " + (timings.firstByteAt - timings.startAt));
	console.log("DNS (ms)       : " + (timings.dnsLookupAt - timings.startAt));
	console.log("Connect (ms)   : " + (timings.tcpConnectionAt - timings.startAt));
	console.log("tls (ms)       : " + (timings.tlsHandshakeAt - timings.startAt));
	console.log("total time (ms): " + (timings.endAt - timings.startAt));
	if (totalCount++ < maxCount) {
		Timing();
	}
	else {
		fs.writeFile('request.dat',  Buffer.concat(chunks), 'utf8', function(err,data){});
		console.log('last response was written to request.dat');
		console.log("average time (ms): " + (totalTime/maxCount));
	}
    })
  });
  req.on('socket', (socket) => {
    socket.on('lookup', () => {
      timings.dnsLookupAt = new Date()
    })
    socket.on('connect', () => {
      timings.tcpConnectionAt = new Date()
    })
    socket.on('secureConnect', () => {
      timings.tlsHandshakeAt = new Date()
    })
  });
  req.end();
}
Timing();
