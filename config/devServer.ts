import  express from 'express';
import  webpack from 'webpack';
import  webpackDevMiddleware from 'webpack-dev-middleware';
import config from './webpack.config.dev';
import webpackHotMiddleware from 'webpack-hot-middleware'
const openBrowser = require('./openBrowser');

const app = express();
const compiler = webpack(config);

app.use(
	webpackDevMiddleware(compiler, {
		publicPath: config.output!.publicPath!,
		stats: { colors: true }
	})
);

app.use(webpackHotMiddleware(compiler));

const port = process.env.PORT ? Number.parseInt(process.env.PORT) : 8080;

app.listen(port, function() {
	console.log(`Example app listening on port ${port}!\n`);
	// openBrowser(`http://127.0.0.1:${port}`);
});
