const parseArgv = (options, isStringify = true) => argv => {
	// Dont care about node server, only care about -port 3000 -path .....
	// params = ['port 3000', 'path /public']
	if (argv.length <= 2) return {};
	const params = argv.slice(2);
	let currentProp = params[0];
	const parsedOption = {};

	if (!options.includes(currentProp)) throw new Error('Invalid prop, unknown argument: ' + currentProp);

	for (let i = 0; i < params.length; ++i) {
		if (options.includes(params[i])) {
			currentProp = params[i];
			parsedOption[currentProp] = [];
		} else {
			parsedOption[currentProp].push(params[i]);
		}
	}

	if (isStringify) {
		return Object.fromEntries(
			Object.entries(parsedOption)
				.map(entry => [entry[0], entry[1].join(' ')])
		);
	}

	return parsedOption;
}

module.exports = parseArgv;