import config from './config.js'

//TODO secure that || retrieve trough cloud functions
import serviceAccount from '../../config/serviceAccount.js'
import * as admin from'firebase-admin'

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: config.databaseURL
})

export default admin