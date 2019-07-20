import config from './config.js';
import * as mod from '@firebase/app';

import '@firebase/auth'
import '@firebase/firestore'
import '@firebase/storage'
import '@firebase/messaging'

let app = mod.default.initializeApp(config)

export default app