const fbHost = "https://graph.facebook.com/v8.0"

var me = function(accessToken){
	var api = fbHost + "/me?fields=id,name,email,picture.type(large)" + "&access_token=" + accessToken;
	const options = {
        method: "GET",
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    };
    return fetch(api, options).then(response => {return response.json()})
}


module.exports = {
	me
}