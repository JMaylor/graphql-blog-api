const post = require('../../models/post');
const authResolver = require('./auth');
const postResolver = require('./post');

module.exports = {
	...authResolver,
	...postResolver
}