<template>
  <div>
    <dashboard-navbar :showSearch="true" @onSearch="onSearch"></dashboard-navbar>

    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
      <base-button type="danger" @click="showUploadModal = true">Upload</base-button>
    </base-header>
    <div>
      <div class="public-flex" v-if="filteredStickers.length > 0">
        <div v-for="(sticker, i) in filteredStickers" :key="i" v-on:click="onClickCell(sticker, i)">
          <sticker-grid-item :stickerJson="sticker.object"
                             :index="i"></sticker-grid-item>
        </div>
      </div>
    </div>
    <div>
    </div>
    <modal :show.sync="showModal">
      <template slot="header">
        <h1 class="modal-title" v-if="this.selectedSticker">{{this.selectedSticker.object.name}}</h1>
      </template>
            <sticker-details-modal :sticker="this.selectedSticker"/>
      <template slot="footer">
         
      </template>
    </modal>

    <modal :show.sync="showUploadModal">
      <template slot="header">
        <h1 class="modal-title">Upload Your Sticker File</h1>
      </template>
      <div>
        <upload-view/>
      </div>
      <template slot="footer">
      </template>
    </modal>
  </div>
</template>

<script>
import StickerGridItem from './../components/StickerGridItem.vue'
import StickerModal from './Modals/StickersDetails.vue'
import Constants from './../Constants.vue'
import UploadView from './../components/UploadView.vue'
import DashboardNavbar from './../layout/DashboardNavbar.vue';

  export default {
    components: {
      StickerGridItem, 
      UploadView,
      DashboardNavbar,
      'sticker-details-modal' : StickerModal
    },
    data() {
      return {
        stickers:[/*{url, object} */],
        filteredStickers: [],
        urls:[
        ],
        showModal:false,
        selectedSticker:null,
        stateBtnFav: false,
        titleBtnFav: "Add to Fav",
        showUploadModal: false,
        searchKey: ''
      };
    },
    computed:{
      selectedStickersCount: function(){
        return this.selectedSticker.object.stickers ? this.selectedSticker.object.stickers.length : 0; 
      },

    },
    methods:{
      getPublicStickers(){
        const options = {
          method: "GET",
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        };
        const api = Constants.API.Host + '/api/publicstickers'
        fetch(api, options).then(response =>{
          return response.json();
        }).then(result => {
          console.log(result);
          if (result.status_code == 200){
            this.urls = result.data;
            this.fetchJsonArray(this.urls);
          }
        })
      },
      fetchJsonArray(urls){
        const options = {
          method: "GET",
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        };
        var requests = [];
        for (var i = 0; i < urls.length; i++){
          requests.push(
            fetch(urls[i], options).then(res => res.ok && res.json() || Promise.reject(res))
            );
        }
        Promise.all(requests).then(data => {
          console.log(data);
          this.stickers = [];

          for (var i = 0; i < data.length; i++){

            var sticker = {
              url: this.urls[i],
              object: data[i]
            }


            this.stickers.push(sticker)

          }
          this.performSearch();
          this.showDetails();
        }).catch(error => {
          console.log(error);
        })
      },
      onClickCell(sticker, i) {
        // let value = items.find(v => v.index === index)
        // console.log("items:" + index + " - " + value.length);

        this.selectedSticker = sticker;
        console.log(this.selectedSticker.url, i);
        this.showModal = true;

      },
      closeModal(){
        this.showModal = false;
      },
      onSearch(text){

        this.searchKey = text;
        this.performSearch();
        console.log("performSearch", this.searchKey);

      },
      performSearch(){

        if (this.stickers.length <= 0){
          return ;
        }

        if (this.searchKey){

          const filterKey = this.searchKey;
          // 1. Filter by name

          var result = this.stickers.filter(function (val){
            return val.object.name.toLowerCase().indexOf(filterKey.toLowerCase()) !== -1;
          })

          this.filteredStickers = result;

        }else{
          this.filteredStickers = this.stickers;
        }

      },
      showDetails(){
        var jsonId = decodeURIComponent(this.$route.params.query);

        // 1. Check id
        if (jsonId){
          // 2. Find object by id
          var result = this.stickers.filter(function(val){
            return (val.object.identifier == jsonId);
          });

          // 3. Show Details
          if (result.length >=1){
            var sticker = result[0];
            this.selectedSticker = sticker;
            this.showModal = true;
          }
        }
        

      }
    },
    mounted() {
      this.getPublicStickers();

    }
  };
</script>
<style>
.public-flex {
  display: flex;
  flex-wrap: wrap;
  background-color: transparent;
  width: 100%;
}

.public-flex > div {
  background-color: transparent;
  width: 160px;
  margin: 4px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
}


</style>
