
function create(statusCode, data, error = null){
	return {
		"status_code": statusCode,
		"data": data,
		"error": error
	};
}

module.exports = { create }
