import sirv from 'sirv';
import path from 'path';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const staticDir = path.resolve(__dirname, '../../../static');

polka() // You can also use Express
	.use(
		compression({ threshold: 0 }),
		sirv(staticDir, { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
