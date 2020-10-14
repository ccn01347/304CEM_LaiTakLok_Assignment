const Joi = require('Joi');
const db = require('./connection');
const monk = require('monk');
const cloudinary = require('./../cloudinary');

const server_general = db.get('server_general');


var getPublicStickers = function  (forceUpdate = false) {
	// body...
	// 1. Check DB contained urls
	const query = {
		key: "public_stickers"
	}
	var step1 = server_general.findOne(query).then(result => {
		if (result){
			// DB record exist
			// 1.b. compare the date

			var last_update = result.last_update;
			var current = new Date();
			// console.log("current:" + current);
			// console.log("last_update:" + last_update);

			var diff = current - last_update;
			console.log("Last update til now is " + (diff / 3600000) + "hr(s)");

			console.log("1.c. Check if > 1 day");
			// 1.c. Check if > 1 day
			if (diff > 86400000 || forceUpdate){
				// 1.d. update from cloudinary again
				return cloudinaryUpdatePublicStickers();
			}else{
				return Promise.resolve(result);
			}
		}else{
			// 2. Fetch from Cloudinary
			console.log(003)
			return cloudinaryFetchPublicStickers();
		}
	}).catch(error => {
		return Promise.reject(error);
	});

	return step1;
	
}

var cloudinaryFetchPublicStickers = function() {
	return cloudinary.getPublicStickers().then((result2) => {
		var urls = [];
		for (var i = 0; i < result2.resources.length; i++){
			urls.push(decodeURI(result2.resources[i].secure_url));
		}
		// 2.a. Write into record
		var record = {
			key: "public_stickers",
			data: urls,
			last_update: new Date()
		}
		return server_general.insert(record).then((result3) => {
			console.log("Public Stickers 1st time Fetch success");
			return Promise.resolve(record);
		}).catch(error => {
			console.log(error);
			return Promise.resolve(record);
		})
		// res.json(urls);
	}).catch((error) => {
		return Promise.reject(error);
	});
}

var cloudinaryUpdatePublicStickers = function(){
	return cloudinary.getPublicStickers().then((result2) => {
		var urls = [];
		for (var i = 0; i < result2.resources.length; i++){
			urls.push(decodeURI(result2.resources[i].secure_url));
		}
		// 2.a. Write into record
		var from = {
			key: "public_stickers"
		}
		var record = {
			key: "public_stickers",
			data: urls,
			last_update: new Date()
		}
		return server_general.findOneAndUpdate(from, {$set: record}).then((result3) => {
			console.log("Public Stickers Update to DB success");
			return Promise.resolve(record);
		}).catch(error => {
			console.log(error);
			return Promise.resolve(record);
		})
		// res.json(urls);
	}).catch((error) => {
		return Promise.reject(error);
	});
}

module.exports = {
	getPublicStickers
}