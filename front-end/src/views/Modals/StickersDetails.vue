<template>
    <div v-if="this.sticker">

      <div>
        <h5 class="modal-title">Publisher: {{this.sticker.object.publisher}}</h5>
        <h5 class="modal-title">Quantity: {{this.sticker.object.stickers.length}}</h5>
        <sticker-grid-56 :stickers="this.sticker.object.stickers"/>

      </div>
      <div v-bind="sticker">
        <div class="div-center-horizontal">
         <base-button v-if="!hiddenFavButton" v-bind:outline="!stateBtnFav" @click="onAddFavorite" type="danger"><i class="ni ni-favourite-28"/></base-button>
          <base-button class="btn-download" outline type="success" @click="onDownload">Download</base-button>
        </div>
      </div>
    </div>
</template>

<script>
import StickerGrid56 from './../../components/StickersGrid56.vue'
import SLVueUtils from './../../SLVueUtils.js'
import Cookies from 'js-cookie';
import Constants from './../../Constants.vue'
  export default {
    name: 'sticker-details-modal',
    components:{
      StickerGrid56
    },
    props:{
      sticker:{
        type: Object,
        default: null
      },
      hiddenFavButton:{
        type: Boolean,
        default: false
      }
    },
    data(){
      return{
        stateBtnFav: false,
      }
    },

    methods:{
      onAddFavorite(){
        const userid = Cookies.get("userid");
        console.log(userid);
        var body = {
          "userid": userid,
          "url": this.sticker.url
        };

        console.log(body);

        const options = {
          method: this.stateBtnFav ? "DELETE" : "PUT",
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(body)
        };

        console.log(options);

        const api = Constants.API.Host + '/api/favoritelist';
        fetch(api, options).then((response) => {
          return response.json();
        }).then((result) => {
          if (options.method === "DELETE"){
            if (result.status_code == 200){
              // remove success
              this.stateBtnFav = false;
            }else{
              // remove failed
              this.$alert(result.error, "Notice", "warning");
            }
          }else if (options.method == "PUT"){
            if (result.status_code == 501){
              // Already in fav
              this.stateBtnFav = true;
              this.$alert(result.error, "Notice", "warning");

            }else if (result.status_code == 200){
              // Success added into fave
              this.stateBtnFav = true;
            }
          }
        });
      },

      onDownload(){
        SLVueUtils.downloadJson(this.sticker.object, this.sticker.object.name);
      },

      checkIsInFavorite(){
        var query = "url=" + this.sticker.url;
        query += "&userid=" + Cookies.get("userid");
        query += "&access_token=" + Cookies.get("access_token");
        const options = {
          method: "GET",
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        };

        const api = Constants.API.Host + '/api/isinfavoritelist?' + query;
        console.log(api);
        fetch(api, options).then((response) => {
          return response.json();
        }).then((result) => {
          console.log(result.data);
          this.stateBtnFav = result.data;
        });
      }
    },

    updated(){
      this.$nextTick(function(){
        this.checkIsInFavorite()
      })
    }
    
  };
</script>


<style>

.div-center-horizontal{
  text-align: right;
/*  .btn-download {
    width: 60%;
  }*/
}

</style>

