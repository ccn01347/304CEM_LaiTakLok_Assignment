<template>
  <div class="card shadow" :class="type === 'dark' ? 'bg-default': ''">
    

    <div class="table-responsive">
      <base-table class="table align-items-center table-flush"
                  :class="type === 'dark' ? 'table-dark': ''"
                  :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                  tbody-classes="list"
                  v-bind:data="favList">
        <template slot="columns">
          <th>My Favorite Stickers</th>
          <th></th>
        </template>

        <template slot-scope="{row}">
          <my-favorite-table-cell :jsonUrl="row" :onActionCallback="onTableCellCallback" :key="row"></my-favorite-table-cell>
        </template>

      </base-table>
    </div>

    <div class="card-footer d-flex justify-content-end"
         :class="type === 'dark' ? 'bg-transparent': ''">
      <base-pagination :total="total" :perPage="countPerPage" @input="onPageChange" :value="currentPage + 1" :key="total"></base-pagination>
    </div>

    <modal :show.sync="showModal">
      <template slot="header">
        <h1 class="modal-title" v-if="this.selectedSticker">{{this.selectedSticker.object.name}}</h1>
      </template>
            <sticker-details-modal :sticker="this.selectedSticker" :hiddenFavButton="true"/>
      <template slot="footer">
         
      </template>
    </modal>
  </div>
</template>
<script>
import Constants from './../../Constants.vue'
import Cookies from 'js-cookie'
import MyFavoriteTableCell from './../../components/MyFavoriteTableCell.vue'
import StickerDetailsModal from './../Modals/StickersDetails.vue'
  export default {
    components:{
      MyFavoriteTableCell, StickerDetailsModal
    },
    name: 'my-favorite-table',
    props: {
      type: {
        type: String
      },
      title: String,
    },
    data() {
      return {
        favList:[],
        selectedSticker: null,
        showModal: false,
        currentPage: 0,
        countPerPage: 2,
        total: 0

      }
    },
    methods:{
      fetchMyFavList() {
        const userId = Cookies.get("userid");
        console.log(userId);

        const options = {
          method: "POST",
          headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }),
          body:JSON.stringify({
            "userid": userId,
            "page": this.currentPage,
            "limit": this.countPerPage
          })
        };
        const url = Constants.API.Host + '/api/favoritelist';

        fetch(url, options).then((response) => {
          return response.json();
        }).then((result) => {
          console.log(result);
          if (result.status_code == 200){
            this.favList = result.data.list;
            this.total = result.data.total;
            console.log(this.favList);
            // var favList = [];
            // for (var i = 0; i < result.data.length; i++){
            //   favList.push(result.data[i].url);
            // }
            // this.favList = favList;
          }
        });
      },
      onTableCellCallback(actionType, data){
        console.log(actionType + data);
        if (actionType == 'remove'){
          const url = data;
          this.removeUrl(url);
        }else if (actionType == 'details'){
          this.selectedSticker = data;
          console.log(this.selectedSticker.object)
          this.showModal = true;
        }
      },
      removeUrl(url){
        const userid = Cookies.get("userid");

        var body = {
          "userid": userid,
          "url": url
        };

        console.log(body);

        const options = {
          method: "DELETE",
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
          if (result.status_code == 200){
            // remove success
            this.fetchMyFavList();


          }else{
            // remove failed
            this.$alert(result.error, "Notice", "warning");
          }
        });



      },
      onPageChange(input){
        this.currentPage = input - 1;
        console.log(input, this.currentPage);

        this.fetchMyFavList();
      }
    },
    mounted() {
      // console.log(this.currentPage);
      this.fetchMyFavList();
    }
  }
</script>
<style>

.media-body{
  padding-right: 8px
}

.avatar-group{
  width: 
}
.avatar .avatar-sm .rounded-circle{
  width: 60px;
}

</style>
