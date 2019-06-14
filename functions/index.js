const functions = require('firebase-functions');
const express = require('express');

// We have to import the built version of the server middleware.
const { server } = process.env.NODE_ENV == "development" ? require('./__sapper__/dev/server/server') : require('./__sapper__/build/server/server');
exports.ssr = functions
	.region('us-central1')
	.https.onRequest(server);