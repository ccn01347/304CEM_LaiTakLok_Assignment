<template>
  <div>
    <div>
      <label>File
        <input type="file" id="file" ref="file" v-on:change="handleFileUplolad()"/>
      </label>
    </div>
    <div v-if="fileJson !== null">
      <h2>Preview</h2>
      <form role="form">
        <div>
              Name:
          <base-input alternative placeholder="Missing name is not allowed" v-model="model.name" :valid="model.name.length > 0"></base-input>
              Published by:
          <base-input alternative placeholder="Missing Publisher is not allowed" v-model="model.publisher" :valid="model.publisher.length > 0"></base-input>
              Identifier:
          <base-input alternative placeholder="This field must be unique" v-model="model.identifier" :valid="model.identifier.length > 0"></base-input>

        </div>

    </form>
      <sticker-grid-56 :stickers="this.fileJson.stickers"/>

    </div>
    <base-button v-if="this.verifyModel" class="btn-submit-json" type="success" v-on:click="submitFile()">Submit</base-button>
    <div v-if="error">
      <base-alert type="danger">
        <strong>Error! - </strong> {{error}}</base-alert>
    </div>

  </div>
</template>


<script>
// import Constants from './../Constants'
import StickerGrid56 from './../components/StickersGrid56.vue'
import UploadService from "./../api/UploadFilesService";
import Cookies from 'js-cookie'

export default{
  name: 'upload-view',
  components:{
    StickerGrid56
  },
  data(){
    return {
      file: '',
      fileReader: new FileReader(),
      fileJson: null,
      model:{
        name:'',
        publisher: '',
        identifier: '',
        ios_app_store_link: '',
        android_play_store_link: ''
      },
      error: null
    }
  },
  methods:{
    handleFileUplolad(){
      this.file = this.$refs.file.files[0];
      this.fileJson = null;
      this.error = null;
      this.model = {};
      this.fileReader.onload = e => {
        try{
          const result = JSON.parse(e.target.result);
          var verify = this.verifyJson(result);
          if (verify == "success"){
            this.fileJson = result;
            // Copy the json into model for verification
            this.model = JSON.parse(JSON.stringify(result));

            console.log(result);
          }else{
            this.error = verify;
          }
        }catch (error){
          this.error = "File format not accepted";
        }

      }
      this.fileReader.readAsText(this.file);
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

      UploadService.upload(this.file, userid, access_token, event => {
        console.log(Math.round((100 * event.loaded) / event.total));
      }).then(response => {
        if (response.status == 200){
          console.log(response);
          this.$alert("Your uploaded sticker will be shown soon.", "Upload Success", "success").then(() => {
            console.log("zxxx");
            this.$refs.file.type = 'text';
            this.$refs.file.type = 'file';
            this.file = '';
            this.fileJson = null;
            this.model = {
              name:'',
              publisher: '',
              identifier: '',
              ios_app_store_link: '',
              android_play_store_link: ''
            }
          });
        }else{
          this.$alert("The upload service is not available, please try again later.", "Something wrong", "Warning");
        }
      }).catch(error => {
        console.log(error);
      })
    },
    verifyJson(json){
      if (!json.stickers){
        return "File format not accepted";
      }

      if (json.stickers.length <= 0){
        return "File not contain any json";
      }

      if (json.stickers[0].image_data === ''){
        return "Image data cannot empty";
      }

      return "success";
    },

  },
  computed:{
    verifyModel: function() {
      var temp = {};
      if (this.model.name && this.model.publisher && this.model.identifier){
        temp.name = this.model.name;
        temp.publisher = this.model.publisher;
        temp.identifier = this.model.identifier;
        temp.ios_app_store_link = this.model.ios_app_store_link;
        temp.android_play_store_link = this.model.android_play_store_link;


        if (!this.model.ios_app_store_link){
          temp.ios_app_store_link = "https://itunes.apple.com/us/app/wstick/id1442273161?mt=8";
        }

        if (!this.model.android_play_store_link){
          temp.android_play_store_link = "https://play.google.com/store/apps/details?id=com.whatdir.stickers"
        }
        console.log("model verify", temp);
        return temp;
      }else{
                  console.log("none");

        return null;
      }
    }
  }
}
</script>


<style>


.btn-submit-json{
  /*position: center;*/
  position: center;
  width: 60%;
  left: 20%;

}
</style>