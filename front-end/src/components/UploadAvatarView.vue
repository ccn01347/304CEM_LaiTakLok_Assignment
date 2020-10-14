<template>
  <div>
    <div>
      <label>File
        <input type="file" id="file" ref="file" v-on:change="hangleFileUplolad()"/>
      </label>
    </div>
    <div v-if="file">
      <h2>Preview</h2>
      <img v-bind:src="imageUrl" class="avartar-image"/>
    </div>
    <base-button v-if="!error && file" class="btn-submit-image" type="success" v-on:click="submitFile()">Submit</base-button>
    <div v-if="error">
      <base-alert type="danger">
        <strong>Error! - </strong> {{error}}</base-alert>
    </div>

  </div>
</template>


<script>

import Cookies from 'js-cookie';
import UploadProfileImageService from './../api/UploadProfileImageService'

export default{
  name: 'upload-avatar-view',
  components:{
  },
  data(){
    return {
      file: '',
      error: null
    }
  },
  methods:{
    hangleFileUplolad(){
      this.file = this.$refs.file.files[0];
      var verify = this.verifyImage(this.file);
      if (verify === "success"){
        // Upload file
        this.error = null;
      }else{
        this.error = verify;
      }

    },
    submitFile(){

      var userid = Cookies.get('userid');
      var access_token = Cookies.get('access_token');

      if (!userid || !access_token){
        this.$alert("You have to login first", "Member Only", "warning").then(() => {
          window.location.href = 'http://localhost:8080/static/'
        });
        return;
      }

      UploadProfileImageService.upload(this.file, userid, access_token, event => {
        console.log(Math.round((100 * event.loaded) / event.total));
      }).then(response => {
        return response.data;
      }).then(result => {
        if (result.status_code === 200){
          this.$emit('onUploadImageDone');
        }else{
          this.$alert(result.error, "Error", "warning");
        }
      }).catch(error => {
        console.log(error);
      })

      
    },
    verifyImage(file) {
      if (file.size > (512 * 512)){
        return "File too big (> 512KB)";
      }

      return "success";
    }
  },
  computed:{
    imageUrl(){
      return URL.createObjectURL(this.file);
    }
  }

}
</script>
<style>
.avartar-image{
  width: 100%;
  height: auto;
}

.btn-submit-image{
  margin-top: 10px;
  position: center;
  width: 60%;
  left: 20%;
}
</style>