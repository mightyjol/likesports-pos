import sirv from 'sirv';
import path from 'path';
import polka from 'polka';
import uuidv4 from 'uuid/v4';
import helmet from 'helmet';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const staticDir = path.resolve(__dirname, '../../../static');

 // You can also use Express
let server = polka();

server.use((req, res, next) => {
		res.locals = { nonce: uuidv4() }
		next();
	})
	.use(helmet({
		contentSecurityPolicy: {
			directives: {
				scriptSrc: [
					"'self' blob: 'sha256-TF7U84tA0VzyQA3Efu0uBtYe16CfzpO1cMqhN/qKFJ8='",
					(req, res) => `'nonce-${res.locals.nonce}'`
				]
			}
		}
	}))
	.use(
		compression({ threshold: 0 }),
		sirv(staticDir, { dev }),
		sapper.middleware()
	);

try{
	server.listen(PORT, err => {
		if (err) console.log('error', err);
	});
}
catch(e){
	if (err.code === 'EADDRINUSE') {
	    // port is currently in use
	    console.error('port already in use');
	}
}
