var express = require('express');
var router = express.Router();
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

var request = require('request');


/* GET users listing. */
router.get('/auth/redirect', function(req, res, next) {
	let code = req.query.code;
	let state = req.query.state;
	let redirect_url = 'http://localhost:3000/slack/auth/user';
	if (typeof code !== 'undefined' && state == "testapp") {
		console.log('yey');
		request.get('https://slack.com/api/oauth.access?client_id=' + config.auth_client_id + '&client_secret=' + config.auth_client_secret + '&code=' + code, function(err, response, body) {
			console.log('yoooo');
			let result = JSON.parse(body);
			console.log('result: ', result);
			console.log('yyy:', result.user.name);
			console.log('ff:', result.user.image_512);
		})
	} else {
		console.log(state);
		console.log(typeof code);
	}

});





module.exports = router;
