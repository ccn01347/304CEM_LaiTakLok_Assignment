const crypto = require('crypto');
const secret_key = "304CEMLAITAKLOK";
const algorithm = "aes-256-cbc";


function genAccessToken(_id, email, password, logintime){
	const json = JSON.stringify({
		_id: _id,
		email: email,
		pws: password,
		last_login: logintime
	});

	var cipher = crypto.createCipher(algorithm, secret_key);
	var crypted = cipher.update(json, 'utf8', 'hex');
	const access_token = crypted + cipher.final('hex');

	// const access_token = crypto.createHmac('sha256', secret)
 //                   .update(str)
 //                   .digest('hex');

	console.log(access_token);
	return access_token;
}

function parseAccessToken(access_token){

	var dechiper = crypto.createDecipher('aes-256-cbc', secret_key);
	var json = dechiper.update(access_token, 'hex', 'utf8')
	json += dechiper.final('utf8');
    return json;
}

module.exports = {
	genAccessToken, parseAccessToken
}