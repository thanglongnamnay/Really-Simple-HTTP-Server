const fs = require('fs');

const lastItem = array => array[array.length - 1];

const isDirectory = source => new Promise((res, rej) => {
	fs.lstat(source, (err, stat) => {
		if (err) rej(err);
		else res(stat.isDirectory());
	});
});

const fileExist = source => new Promise(res => {
	fs.access(source, fs.constants.F_OK, err => {
		res(!err);
	});
});

const unary = fn => arg => fn(arg);

module.exports = Object.freeze({
	lastItem,
	isDirectory,
	fileExist,
	unary,
});

