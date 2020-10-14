const db = require('./connection');

const member_upload = db.get('member_upload');


function add(url, asset_id, userId){
	const query = {
		"userid": userId,
		"url": url,
		"asset_id": asset_id
	}

	member_upload.count(query).then((count) => {
		if (count <= 0){
			return member_upload.insert(query);
		}else{
			return Promise.reject("Already in Upload List");
		}
	});

}

function update(from, to){
	options = {
		"returnOriginal": true,
		"returnNewDocument": true
	};
	return member_upload.update(from, {$set: to}, options);
}


function get(userId, option = {}){
	const query = {
		userid : userId
	};
	return member_upload.find(query, option);
}

function getByQuery(query, option = {}){
	return member_upload.find(query, option);
}



function totalCount(userId){
	const query = {
		userid: userId
	}
	return member_upload.count(query);
}


module.exports = { add, update, get, getByQuery, totalCount }

