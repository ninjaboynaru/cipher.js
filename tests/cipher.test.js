const chai = require('chai');
const mockFs = require('mock-fs');
const fs = require('fs');
const cipher = require('../public/js/cipher.js');
const expect = chai.expect;


describe('cipher.js tests', function(){
	afterEach(function(){
		mockFs.restore();
	});

	it('Can cipher and decipher empty file', function(done){
		const inputFilePath = 'input.empty.txt';
		const outputFilePath = 'output.empty.txt';
		mockFs({
			[inputFilePath]: ''
		});

		cipher(inputFilePath, outputFilePath, function(error){
			expect(error).to.not.exist;
			const outputFileBuffer = fs.readFileSync(outputFilePath);
			expect(outputFileBuffer.length).to.equal(0);
			done();
		});

	});

	it('Can cipher and decipher a small file', function(done){
		const inputFilePath = 'input.small.txt';
		const outputFilePath = 'output.small.txt';
		const decipherFilePath = 'decipher.small.txt';

		const inputText = `!@#$%^&*()_+-= []{}|:<>,./? No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a grand jury, except in cases arising in the land or naval forces, or in the militia, when in actual service in time of war or public danger; nor shall any person be subject for the same offense to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.`
		const inputFileBuffer = Buffer.from(inputText);

		mockFs({
			[inputFilePath]: inputText
		});

		cipher(inputFilePath, outputFilePath, function(error) {
			expect(error).to.not.exist;
			const outputFileBuffer = fs.readFileSync(outputFilePath);
			expect(outputFileBuffer.length).to.equal(inputText.length);
			expect(Buffer.compare(inputFileBuffer, outputFileBuffer)).to.not.equal(0);

			cipher(outputFilePath, decipherFilePath, onDecipher);
		});

		function onDecipher(error) {
			expect(error).to.not.exist;
			const decipherFileBuffer = fs.readFileSync(decipherFilePath);

			expect(decipherFileBuffer.length).to.equal(inputText.length);
			expect(Buffer.compare(inputFileBuffer, decipherFileBuffer)).to.equal(0);

			done();
		}
	});
});
