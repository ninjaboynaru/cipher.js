const stream = require('stream');
const fs = require('fs');

/**
* Encrypt (or decrypt) and input file path by inverting
* all its bits.
*
* @param {string} inputFile - Path to an input file
* @param {string} outputFile - Path to an output file
* @param {function} callback - Function to be called when encryption is finished. If an error
* occures, the error will be passed as the first argument.
*/
module.exports = function cipher(inputFile, outputFile, callback) {
	let readFile;
	let cipherStream;
	let writeFile;
	try {
		readFile = fs.createReadStream(inputFile);
		cipherStream = new CipherStream();
		writeFile = fs.createWriteStream(outputFile);
	}
	catch(error) {
		callback(error);
		return;
	}
	readFile.pipe(cipherStream).pipe(writeFile);

	if(typeof callback != 'function') {
		callback = ()=>{};
	}

	writeFile.on('finish', function() {
		closeStreams();
		callback(null);
	});
	writeFile.on('error', function(error) {
		closeStreams();
		callback(error);
	});

	function closeStreams() {
		cipherStream.end();
		writeFile.end();
	}
}

class CipherStream extends stream.Transform {
	constructor() {
		super();
	}
	// use xor to invert each chunk (turn 1s into 0s and vice0-versa)
	_transform(chunk, encoding, callback) {
		for(let i = 0; i < chunk.length; i++) {
			chunk.writeUInt8(chunk[i] ^ 1, i);
		}
		this.push(chunk);
		callback();

	}
}
