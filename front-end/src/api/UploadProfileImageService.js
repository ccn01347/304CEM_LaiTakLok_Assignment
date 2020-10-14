import http from "./../http-common";

class UploadProfileImageService {
  upload(file, userid, access_token, onUploadProgress) {
    let formData = new FormData();

    //Note that req.body might not have been fully populated yet. It depends on the order that the client transmits fields and files to the server.
    
    formData.append('userid', userid);
    formData.append('access_token', access_token);
    formData.append("profilepic", file);


    return http.post("/api/uploadprofilepic", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress,

    });
  }

  // getFiles() {
  //   return http.get("/files");
  // }
}

export default new UploadProfileImageService();