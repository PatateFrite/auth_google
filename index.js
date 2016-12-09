const express = require('express')
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
const port = 8080;

const admins = [ 'jeremy.thille@gmail.com'];

app.use(express.static(__dirname))

app.get('/secret', (req, res) => authenticate(req, res))

app.listen(port, () => {
	console.log("App listening on port " + port)
})

const authenticate = (req, res) => {
	console.log("id_token = ", req.query.id_token);
	let rawData = '';

	https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=' + req.query.id_token, (stream) => {
		stream
			.on('data', (chunk) => rawData += chunk)
			.on('error', (e) => log("Got error: " + e.message))
			.on('end', () => {
				let data = JSON.parse(rawData)
				console.log(data);
				if (admins.indexOf(data.email) > -1) {
					res.status(200).send('Authorised! :)');
				} else {
					res.status(403).redirect('');
				}

			});
	});
}
