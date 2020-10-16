const express = require('express');
const qs = require('qs');
const http = require('http');
const https = require('https')
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const members = require('./db/members');
const general = require('./db/general');
const favoritelist = require('./db/favouritelist');
const apiResult = require('./api/APIResult');
const db = require('./db/connection');
const cloudinary = require('./cloudinary');
const monk = require('monk');
const SLUtils = require('./SLUtils.js');
const Waterfall = require('promise.waterfall')
const sgMail = require('@sendgrid/mail');
const uploadList = require('./db/uploadlist');


var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './temp_upload')
  },
  filename: function (req, file, cb) {
  	var filename = ""
  	if (req.url === "/api/uploadprofilepic"){
  		var userid = req.body.userid;
  		var fileNameComponents = file.originalname.split('.');
  		var extension = fileNameComponents[fileNameComponents.length - 1];
  		filename = "avatar_" + userid + "_." + extension;
  	}else{
  		filename = file.originalname;
  	}
    cb(null, filename)
  }
})

var upload = multer({ storage: storage })



sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const app = express();
 app.set('query parser', function (str) {
  return qs.parse(str, { decode: function (s) { return decodeURIComponent(s); } });
});

app.use(morgan('tiny'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))



// API
app.get('/', (req, res) => {
    res.json({
        message: 'Behold The MEVN Stack!'
    });
});


// ## API: Login
app.post('/api/oldLogin', (req, res) => {
	console.log("Login requested: %j", req.body);
	members.find(req.body).then((result) => {
		if (result.length == 1){
			var login = result[0];
			if (login.verified){
				// Generate Access Token and update member
				res.json(apiResult.create(200, result, null));
			}else{
				res.json(apiResult.create(201, null, "User is not allowed to login as it is not verified"));
			}
		}else{
			res.json(apiResult.create(501, null, "email & password not matched in record"));
		}
	}).catch((error) => {
		res.json(apiResult.create(501, null, error));
	});
});

// ## API: Login
app.post('/api/login', (req, res) => {
	console.log("new Login: %j", req.body);
	// 1. Find member match

	var loginMatch = new Promise((resolve, reject) =>{
		members.find(req.body).then((result) => {
			if (result.length == 1){
				var login = result[0];
				if (login.verified){
					// Generate Access Token and update member
					resolve(apiResult.create(200, result[0], null));
				}else{
					resolve(apiResult.create(201, null, "User is not allowed to login as it is not verified"));
				}
			}else{
				resolve(apiResult.create(501, null, "email & password not matched in record"));
			}
		}).catch((error) => {
			reject(apiResult.create(501, null, error));
		});
	});

	// 2. update and gen access token
	loginMatch.then((verifiedResult) =>{
		if (verifiedResult.status_code === 200){
			var current = new Date();
			var userData = verifiedResult.data;
			var access_token = SLUtils.genAccessToken(userData._id, userData.email, userData.pwd, current);
			var to = {
				last_login : current,
				access_token : access_token
			};

			var newUserData = JSON.parse(JSON.stringify(userData));
			newUserData.last_login = current;
			newUserData.access_token = access_token;

			console.log(newUserData);
			members.findOneAndUpdate(userData, to).then(result => {
				res.json(apiResult.create(200, newUserData, null));
			}).catch((error) => {
				res.json(apiResult.create(501, null, error));
			});
		}else{
			res.json(verifiedResult);
		}
	}).catch((error) => {
		res.json(error);
	});
});

// ## API: PlatformLogin
app.post('/api/platformlogin', (req, res) => {
	// console.log(req.body);
	var info = {
		fb_userid 	: req.body.userid,
		email 	: req.body.email
	}
	var username 	= req.body.name;
	var fb_userid 	= req.body.userid;
	var email 		= req.body.email;
	var fb_token 	= req.body.fbToken;
	var avatarURL 	= req.body.avatarURL;

	if (!username || ! fb_userid || !email || !fb_token || !avatarURL){
		res.json(apiResult.create(501, null, "Missing required fields"));
	}

	members.findByFbInfo(info).then(result => {
		if (result.length == 0){
			// no user, register

			// var avatarURL = "https://graph.facebook.com/" + fb_userid + "/picture?type=large";

			var signup = {
				username 	: username,
				fb_userid	: fb_userid,
				email 		: email,
				pwd 		: fb_token,
				avatarURL	: avatarURL,
				fb_token	: fb_token
			};

			return members.create(signup, true);

		}else if (result.length == 1){
			// Already have account, login
			var userInfo = result[0];
			return [{}, result[0]];
		}else{
			// should be error here
			throw new Error("DB have more than 1 records");
		}
		// res.json(result);
	}).then(result => {
		var userInfo = result[1];
		if (userInfo.verified){
			// 1. update user profile and gen accesstoken
			var current = new Date();
			var access_token = SLUtils.genAccessToken(userInfo._id, userInfo.email, userInfo.pwd, current);
			var to = {
				last_login : current,
				access_token : access_token,
				fb_token: fb_token,
				fb_userid: fb_userid,
				avatarURL: avatarURL
				// avatarURL: "https://graph.facebook.com/" + fb_userid + "/picture?type=large"
			};
			var newUserInfo = JSON.parse(JSON.stringify(userInfo));
			newUserInfo.last_login = current;
			newUserInfo.access_token = access_token;
			newUserInfo.fb_token = fb_token;
			newUserInfo.fb_userid = fb_userid;
			newUserInfo.avatarURL = avatarURL;

			members.findOneAndUpdate(userInfo, to).then(result => {
				console.log(004);
				res.json(apiResult.create(200, newUserInfo, null));
			}).catch((error) => {
				console.log(005);
				res.json(apiResult.create(501, null, error));
			});
			// res.json(apiResult.create(200, userInfo, null));
		}else{
			// 2. If not verified, send email
			sendGridVerificationEmailTemplate(userInfo.username, userInfo.email, req);
			res.json(apiResult.create(201, userInfo, null));
		}
	}).catch(error => {
		res.json(apiResult.create(500, null, error));
	});
})

// ## API: Signup
app.post('/api/signup', (req, res) => {
	console.log("Signup requested %j", req.body);
	members.create(req.body).then((result) => {
		var userInfo = result[1];
		sendGridVerificationEmailTemplate(userInfo.username, userInfo.email, req);
		res.json(apiResult.create(200, userInfo, null));

	}).catch((error) => {
		res.json(apiResult.create(501, null, error));
	})
});


// ## API: Verfiy email
app.get('/api/memberverify', (req, res) => {
	console.log("memberverify requested: %j", req.query);
	var email = decodeURIComponent(req.query.email);
	console.log("memberverify requested: ", email);

	var from = {
		"email": email,
	};
	var to = {
		"verified": true
	};

	Promise.all([
		members.update(from, to),
		members.findByEmail(email)
		]).then(data => {
			var user = data[1][0];
			console.log(user);
			var url = 'http://localhost:8080/login?username=' + user.username + '&verified=true';
			res.redirect(url);
		}).catch(error => {
			res.json(apiResult.create(501, null, error));
		})
	// members.update(from, to).then((result) => {
	// 	console.log("update result %j", result);
	// 	res.json(apiResult.create(200, result, null));	
	// }).catch((error) => {
	// 	console.log("memberverify error: %j", error);
	// 	res.json(apiResult.create(501, null, error));
	// }).then(() =>{
	// 	db.close();
	// });
});

app.post('/api/forgetpassword', (req, res) => {
	var email = req.body.email;
	members.findByEmail(email).then(result => {
		if (result.length == 1){	
			var userInfo = result[0];
			sendSendGridWithPassword(userInfo).then(sendgrid => {
				res.json(apiResult.create(200, sendgrid, null))
			}).catch(error => {
				res.json(apiResult.create(501, null, error));
			})

		}else{
			res.json(apiResult.create(501, null, "member not found"));
		}
	}).catch(error => {
		res.json(apiResult.create(501, null, error));
	});
})

// ## API: Edit member info
app.post('/api/membereditinfo', (req, res) => {

	if (checkAccessTokenMatched(req.body.userid, req.body.access_token)){
		var from = {
			_id : monk.id(req.body.userid)
		}
		var to = {};
		// username
		if (req.body.tousername){
			to.username = req.body.tousername;
		}

		// avatarURL
		if (req.body.toavatarURL){
			to.avatarURL = req.body.toavatarURL;
		}

		// About me
		if (req.body.toaboutme){
			to.aboutme = req.body.toaboutme;
		}

		// PWD
		if (req.body.topwd){
			to.pwd = req.body.topwd;
		}

		members.update(from, to).then((result) => {
			res.json(apiResult.create(200, result, null));	
		}).catch((error) => {
			console.log("memberverify error: %j", error);
			res.json(apiResult.create(501, null, error));
		}).then(() => {
			db.close();
		});
	}else{
		res.json(apiResult.create(501, null, "Access Deny"));

	}

});

// ## API: Change Password
app.post('/api/changepassword', (req, res) => {
	var oldpwd = req.body.pwd;
	var newpwd = req.body.topwd;
	var newpwd2 = req.body.topwd2;
	var userid = req.body.userid;
	var access_token = req.body.access_token;

	if (newpwd2 !== newpwd){
		// 1. Check password verification.
		res.json(apiResult.create(501, null, "password not matched."))
	}

	// 2. Get the access_token
	if (checkAccessTokenMatched(userid, access_token)){
		// 2. a. Get record
		members.findByUserId(userid).then(result => {
			// 2. b. Check password
			var userInfo = result[0];
			console.log(oldpwd, userInfo.pwd);
			if (userInfo.pwd === oldpwd){
				// 2.c. update profile.
				var from = {
					_id : monk.id(userid)
				}
				var to = {
					pwd : newpwd
				}
				console.log(from, to);
				members.update(from, to).then(result => {
					res.json(apiResult.create(200, result, null));
				}).catch(error => {
					res.json(apiResult.create(501, null, error))
				});
			}else{
							console.log(userInfo);

				res.json(apiResult.create(501, null, "Password is wrong."));
			}
		}).catch(error => {
			res.json(apiResult.create(501, null, error))
		});

	}else{
		res.json(apiResult.create(501, null, "Permission denied."))
	}

})

// ## API: member info
app.post('/api/memberinfo', (req, res) => {

	if (checkAccessTokenMatched(req.body.userid, req.body.access_token)){
		members.findByUserId(req.body.userid).then((result) => {
			if (result.length == 1){
				res.json(apiResult.create(200, result[0], null));
			}else{
				res.json(apiResult.create(501, null, "member not found"));
			}
		}).catch(error => {
			res.json(apiResult.create(501, null, error));
		});

	}else{
		res.json(apiResult.create(501, null, "Access Deny"));
	}
});

// ## API: Get Favorite List POST
app.post('/api/favoritelist', (req, res) => {
	const userid = req.body.userid;
	const limit = req.body.limit;
	const page = req.body.page;
	var options = {};
	if (limit > 0){
		options.limit = limit;
		options.skip = (page * limit);
	}


	Promise.all([
		favoritelist.totalCount(userid),
		favoritelist.get(userid, options)
	]).then(data => {
		var count = data[0];
		var list = [];
		for (var i = 0; i < data[1].length; i++){
			list.push(data[1][i].url);
		}

		var result = {
			page: page ? page : 0,
			count: list.length,
			total: count,
			list: list
		};
		res.json(apiResult.create(200, result, null));
	}).catch(error => {
		res.json(apiResult.create(500, null, error));
	})
});

// ## API: Add Favorite List PUT
app.put('/api/favoritelist', (req, res) => {
	// console.log(req.body);
	var decodedUri = decodeURI(req.body.url);
	favoritelist.add(decodedUri, req.body.userid).then((result) => {
		res.json(apiResult.create(200, result, null));
	}).catch((error) => {
		res.json(apiResult.create(501, null, error));
	});
});

// ## API: Remove Favorite List
app.delete('/api/favoritelist', (req, res) => {
	var decodedUri = decodeURI(req.body.url);
	// console.log(req.body.url);
	// console.log(decodedUri);
	favoritelist.remove(decodedUri, req.body.userid).then((result) => {
		res.json(apiResult.create(200, result, null));
	}).catch((error) => {
		res.json(apiResult.create(501, null, error));
	});
});

// ## API: Check Favorite List 
app.get('/api/isinfavoritelist', (req, res) => {
	console.log(req.query.access_token);
	var access_token = req.query.access_token;
	if (access_token == 'undefined' || access_token == 'null' || !access_token){
		res.json(apiResult.create(501, null, "Access Denied"));
		return;
	}
	var json = JSON.parse(SLUtils.parseAccessToken(req.query.access_token));
	var url = decodeURI(req.query.url);
	// var url = unescape(req.query.url);
	console.log(json);
	console.log(url);
	if (req.query.userid == json._id){
		favoritelist.count(url, req.query.userid).then((count) => {
			console.log("count %j", count);
			res.json(apiResult.create(200, (count > 0), null));

		}).catch((error) => {
			res.json(apiResult.create(501, false, error));
		});
	}else{
		res.json(apiResult.create(500, false, "access_token not correct"));
	}
});

// ## API: Get Favorite List Count
app.get('/api/favoritelistcount', (req, res) => {
	var userid = req.query.userid;
	favoritelist.totalCount(userid).then((count) => {
		res.json(apiResult.create(200, count, null));
	}).catch(error => {
		res.json(apiResult.create(501, 0, error));
	});

})

// ## API: Get Upload count
app.get('/api/uploadlistcount', (req, res) => {
	var userid = req.query.userid;
	uploadList.totalCount(userid).then((count) => {
		res.json(apiResult.create(200, count, null));
	}).catch(error => {
		res.json(apiResult.create(501, 0, error));
	});
})

// TEST
app.get('/api/test', (req, res) =>{

	// 0. Text Get FB profile pic
	var fb_token = req.body.fb_token;
	getFbProfileImage(fb_token).then(result =>{
		res.json(result);
	});


	// 1. Text public stickers
	// general.getPublicStickers(true).then((result) => {
	// 	// console.log('test success');
	// 	// var urls = [];
	// 	// for (var i = 0; i < result.resources.length; i++){
	// 	// 	urls.push(result.resources[i].secure_url);
	// 	// }
	// 	res.json(result);
	// }).catch((error) => {
	// 	console.log('test failed');

	// 	res.json(error);
	// });
});


// ## Public Stickers
app.get('/api/publicstickers', (req, res) => {
	general.getPublicStickers().then(result => {
		console.log(result);
		res.json(apiResult.create(200, result.data, null));
	}).catch(error => {
		res.json(apiResult.create(501, null, error));
	})

});

// ## Public Stickers for static
app.get('/api/publicstickersimgaes', (req, res) => {
	var count = req.query.count;
	if (count === undefined){
		count = 6;
	}
	general.getPublicStickers().then(result => {
		if (result.length < count){
			count = result.length;
		}

		for (var i = 0; i < count; i++){
			
		}
		return result;
	}).then((result) => {

	})
})

app.post('/api/uploadstickerjson', upload.single('file'), (req, res) => {
	let formData = req.file;
	let userid = req.body.userid;
	let access_token = req.body.access_token;

	// 1. Check Access_token

	if (!checkAccessTokenMatched(userid, access_token)){
		res.json(apiResult.create(500, false, "access_token not correct"));
		return;
	}


	// 1.a. Send the file to cloudinary
	var originalName = formData.originalname;
	var mimetype = formData.mimetype;
	cloudinary.uploadStickerJson(formData, userid).then(result => {
		// 1.b. Success
		console.log("cloudinary upload json - ", result);
		return result;
		if (result.overwritten){
			// Update url
		}
		res.json(apiResult.create(200, result, null));
	}).then((result) => {
		// 2. Add the link into db
		var url = result.secure_url;
		if (result.overwritten){
			// 2.a. Find record
			// var query = {
			// 	// url: {$regex: ".*" + encodeURIComponent(result.public_id)},
			// 	asset_id: result.asset_id,
			// 	userid: userid
			// };
			// console.log(507, query);
			// return uploadList.getByQuery(query).then(result => {
			// 	return result;
			// }).catch(error => {
			// 	return Promise.reject(error);
			// });

			// 2.a. Update url
			var from = {
				asset_id: result.asset_id,
				userid: userid
			}

			var to ={
				url: result.secure_url,
				userid: userid
			}
			return uploadList.update(from, to)
		}else{
			// 2.b. add url record
			return uploadList.add(result.secure_url, result.asset_id, userid);
		}
	}).then((dbResult) => {
		// 3. Db result
		res.json(apiResult.create(200, dbResult, null));

	}).catch(error => {
		res.json(apiResult.create(500, null, error));
	});

	// 1.c. Add the link into db

	

	// console.log('form data', formData);
	// res.status(200).send(formData);

})

app.post('/api/uploadprofilepic', upload.single('profilepic'), (req, res) => {


	let formData = req.file;
	let userid = req.body.userid;
	let access_token = req.body.access_token;

	console.log("uploadprofilepic - ", userid, access_token, formData);

	// 1. Check Access Token for permission
	if (checkAccessTokenMatched(userid, access_token)){
		// 2. Upload to Cloudinary
		cloudinary.uploadMemberAvatar(formData, userid).then(result => {

			// 3. Uplaod proifle data

			var from = {
				_id: monk.id(userid)
			}

			var to ={
				avatarURL: result.secure_url
			}
			return members.update(from, to);
		}).then(result => {
			res.json(apiResult.create(200, result, null));
		}).catch(error => {
			res.json(apiResult.create(500, null, error));
		})
		// var filename = 'profile'

		// res.json(apiResult.create(200, formData, null));
	}else{
		res.json(apiResult.create(500, false, "access_token not correct"));
	}
})

// ############################################
// #########  Helper Section 			#######
// ############################################

function checkAccessTokenMatched(userid, access_token){
	var json = JSON.parse(SLUtils.parseAccessToken(access_token));

	if (userid == json._id){
		return true;
	}
	return false;
}

function sendGridVerificationEmailTemplate(username, email, req){
	var url = req.protocol + "://" + req.get('host') + "/api/memberverify?email=" + encodeURIComponent(email);
	// console.log("528-" + url);
	const templateId = process.env.SENDGRID_VERIFICATIONTEMPLATE_ID // "d-92b30b286b89434bb63dc252d1da7677";
	const templateData = {
		USER_NAME: 			username,
		VERIFYEMAIL_URL: 	url
	}

	const msg = {
		to: email,
		from: process.env.SENDGRID_EMAILSENDER, //'stevelai+304cem@steveproduction.com',
		subject: 'Please Verify your StickerMan Account.',
		templateId: templateId,
		dynamic_template_data: templateData
	}

	sgMail.send(msg).then((sendgrid) => {
		console.log(sendgrid);
	}).catch(error => {
		console.log("005 %j", error);
	});
}

function sendSendGridWithPassword(userInfo){
	const msg = {
		to: userInfo.email,
		from: process.env.SENDGRID_EMAILSENDER, //'stevelai+304cem@steveproduction.com',
		subject: 'Your Stickerman Account Password',
		text: userInfo.pwd + '\n\nPlease login and change the password.'
	}
	return sgMail.send(msg);

}


function sendSendGridVerification(username, email, req){
	console.log("001"); 
	var url = req.protocol + "://" + req.get('host') + "/api/memberverify?email=" + encodeURIComponent(email);
	console.log(url);
	var html = verificationHtml(username, url);

	console.log("002 %j", process.env.SENDGRID_APIKEY);

	const msg = {
		to: email,
		from: process.env.SENDGRID_EMAILSENDER, //'stevelai+304cem@steveproduction.com',
		subject: 'Please Verify your StickerMan Account.',
		text: 'Clicking this link to verify your account',
		html: html
	};

	console.log("003 %j", html);

	sgMail.send(msg).then((sendgrid) => {
	}).catch(error => {
		console.log("005 %j", error);
	});
}


function verificationHtml(username, url){
	var html = '<div style="background-color: #DDDDDD"><p>Hi ' + username + ',</p><p>Verify your Sticker Man account by clicking this:</p><h2><span style="background-color: #33cccc; color: #ffffff;"><strong><a style="background-color: #33cccc; color: #ffffff;" href="';
	html += url;
	html += '"> Verify your account </a></strong></span></h2></div>'
	return html;
}

// ## Get Facebook user profile image
function getFbProfileImage(accessToken){
	const api = "https://graph.facebook.com/v8.0/me/picture?access_token=" + accessToken
	return new Promise((resovle, reject) =>{
		https.get(api, (response) => {
			let data = '';

			// A chunk of data has been recieved.
			response.on('data', (chunk) => {
				data += chunk;
			});

			response.on('end', () => {
				console.log(JSON.parse(data).explanation);
				resovle(data);
			})

			// console.log(response);
		}).on('error', error => {
			reject(error);
		});
	});

	// return http.get(api, (res) => {
	// 	console.log(res);
	// 	return res;
	// });
}

const port = process.env.PORT || 4000; 
app.listen(port, () => {
    console.log(`listening on ${port}`);
});