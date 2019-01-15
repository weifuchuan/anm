import webpack from 'webpack';
import config from './webpack.config.prod';
import fs from 'fs-extra';
import { resolveApp } from './kit';

try {
	fs.emptyDirSync(resolveApp('lib'));
} catch (e) {}

webpack(config, (err, stats) => {
	if (err || stats.hasErrors()) {
		console.error(err);
	}
	console.log(
		stats.toString({
			colors: true
		})
	);
});
