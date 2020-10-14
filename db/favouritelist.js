const Joi = require('Joi');
const db = require('./connection');




const schema = Joi.object().keys({
	userid: Joi.string().required(),
	url	: Joi.string().required()
});



const member_favourite = db.get('member_favourite');


function add(url, userId){
	const query = {
		"userid": userId,
		"url": url
	}

	const validation = schema.validate(query);
	if (validation.error){
		return Promise.reject(JSON.stringify(validation.error.details));
	}else{
		return member_favourite.count(query).then((count) => {
			if (count <= 0){
				return member_favourite.insert(query);
			}else{
				return Promise.reject("Already in Fav List")
			}
		});
	}

}

function remove(url, userId){
	const query = {
		"userid": userId,
		"url": url
	}
	return member_favourite.remove(query);
}

function get(userId, option = {}){
	const query = {
		userid : userId
	};
	return member_favourite.find(query, option);
}

function count(url, userId){
	const query = {
		url: url,
		userid: userId
	}
	console.log("query = %j", query );
	return member_favourite.count(query)
}

function totalCount(userId){
	const query = {
		userid: userId
	}
	console.log(query);
	return member_favourite.count(query);
}
module.exports = { add, get, remove, count, totalCount }
