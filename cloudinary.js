require('dotenv').config()

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_APIKEY, 
  api_secret: process.env.CLOUDINARY_APISECRET 
});


function getPublicStickers(){
	// const option = {
	// 	prefix: '304CEM_Cloudinary/',
	// 	type: 'upload'
	// };
	// console.log(process.env.CLOUDINARY_NAME);
	// console.log(process.env.CLOUDINARY_APIKEY);
	// console.log(process.env.CLOUDINARY_APISECRET);
	// cloudinary.v2.api.resources(option, (error, result) =>{
	// 	console.log("result: %j", result);
	// 	console.log("error: %j", error);
	// });
	return cloudinary.v2.search
	.expression('folder:304CEM_Cloudinary* AND format:json')
	.sort_by('public_id','desc')
	.max_results(30).execute();
}


function uploadStickerJson(formData, userid){
	var filePath = formData.path;
	console.log(filePath);
	// var filePath = "./temp_upload/4d8613901226fe71ae02ee2be263a831";
	var folder = "304CEM_Cloudinary/upload_" + userid
	var option = {
		folder: folder,
		resource_type: "raw",
		public_id: formData.originalname
	}

	return new Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(filePath, option, function(error, result){
			if (error){
				reject(error);
			}else{
				resolve(result);
			}
		})
	})

}

function uploadMemberAvatar(formData, userid){
	var filePath = formData.path;
	var folder = "304CEM_Cloudinary/upload_" + userid;
	var option = {
		folder: folder,
		public_id: formData.filename
	}

	return new Promise((resolve, reject) => {
		cloudinary.v2.uploader.upload(filePath, option, function(error, result) {
			if (error){
				reject(error);
			}else{
				resolve(result);
			}
		})
	})
}
module.exports ={
	getPublicStickers, uploadStickerJson, uploadMemberAvatar
}