const Joi = require('Joi');
const db = require('./connection');
const monk = require('monk');




const schema = Joi.object().keys({
	username: Joi.string().required(),
	email	: Joi.string().required(),
	pwd		: Joi.string().required(),
	avatarURL: Joi.string().uri({
		scheme:[/https?/]
	}),
	fb_userid: Joi.string(),
	fb_token: Joi.string()
});


const member_signup = db.get('member_signup');

function create(info, forceVerify = false){
	// 1. check Unique
	// console.log("API-members.create:", info);
	var validate = schema.validate(info);
	if (validate.error){
		return Promise.reject(validate.error);
	}else{
		info.created = new Date();
		info.verified = forceVerify;
		info.last_login = undefined;
		info.access_token = undefined;
		console.log("member signup: %j", info);
		return Promise.all([
			member_signup.createIndex({email: 1}, {unique: true}),
			member_signup.insert(info)
			]);
	}

}

function find(info){
	const option = {
		"email": info.email,
		"pwd": info.pwd,
	};

	return member_signup.find(option);
}
function findByUserId(userId){
	const _id = monk.id(userId);
	return member_signup.find({_id: _id});
}

function findByEmail(email){
	return member_signup.find({email: email});
}
function update(from, to){
	console.log("form: %j - %j", from, to);
	options = {
		"returnOriginal": true,
		"returnNewDocument": true
	};
	return member_signup.update(from, {$set: to}, options);
}

function findOneAndUpdate(from, to){
	console.log("form: %j - %j", from, to);
	options = {
		"returnOriginal": true,
		"returnNewDocument": true
	};
	return member_signup.findOneAndUpdate(from, {$set: to}, options);
}

function findByFbInfo(info){
	const option = {
		email: info.email,
		fb_userid: info.fb_userid
	}
	return member_signup.find(option);
}
module.exports = { create, find, update, findOneAndUpdate, findByUserId, findByEmail, findByFbInfo }
