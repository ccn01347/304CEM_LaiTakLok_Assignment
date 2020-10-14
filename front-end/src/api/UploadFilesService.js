import http from "./../http-common";

class UploadFilesService {
  upload(file, userid, access_token, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);
    formData.append('userid', userid);
    formData.append('access_token', access_token);

    return http.post("/api/uploadstickerjson", formData, {
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

export default new UploadFilesService();