<template>
  <div class="myfav-div">
    <td class="myfave-cell-td">
      <div class="media-body">
        <h3>{{stickerJson ? stickerJson.name : ""}}</h3>
      </div>
      <div class="avatar-group" v-if="stickerJson">
        <a class="avatar avatar-lg rounded-circle" v-for="sticker in stickerJson.stickers.slice(0, 5)" :key="sticker.image_data">
          <img class="grid-img" v-bind:src="base64ToPng(sticker.image_data)"/>
        </a>
      </div>

      <div class="media align-items-center">
        <div class="media-body">
          <span class="name mb-0 text-sm">#{{stickerJson ? stickerJson.stickers.length : -1}}</span>
        </div>
        <div class="media-body">
          <span class="name mb-0 text-sm">{{stickerJson ? stickerJson.publisher : "" }}</span>
        </div>
      </div>
    </td>
    <td class="text-right">
      <base-dropdown class="dropdown"
                     position="right">
        <a slot="title" class="btn btn-sm btn-icon-only text-light" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fas fa-ellipsis-v"></i>
        </a>

        <template>
          <a class="dropdown-item" href="#" @click="onDetails"><i class="ni ni-tv-2" type='danger'/>Details</a>
          <a class="dropdown-item" href="#" @click="onRemove"><i class="ni ni-fat-remove" type='danger'/>Remove</a>
          <a class="dropdown-item" href="#" @click="onDownload"><i class="ni ni-cloud-download-95"/>Download</a>
        </template>
      </base-dropdown>
    </td>

  </div>
</template>

<script>
// import Cookies from 'js-cookie'
import SLVueUtils from './../SLVueUtils.js';
  export default{
    name: "my-favorite-table-cell",
    props:{
      jsonUrl:{
        type: String,
        default: ""
      },
      onActionCallback:{
        type: Function,
        default: function(){}
      }
    },
    data(){
      return {
        stickerJson: null,
      }
    },
    mounted(){
      const options = {
        method: "GET",
        headers: new Headers({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        })
      };
      console.log(this.jsonUrl);
      fetch(this.jsonUrl, options).then(response => {
        return response.json();
      }).then(result => {
        this.stickerJson = result;
      });
    },
    methods:{
      base64ToPng: function(imageBytes){
        return 'data:image/png;base64,' + imageBytes;
      },
      onRemove: function(){
        this.onActionCallback('remove', this.jsonUrl);
      },
      onDownload: function(){
        SLVueUtils.downloadJson(this.stickerJson, this.stickerJson.name);
      },
      onDetails: function(){
        var sticker = {
          url: this.jsonUrl,
          object: this.stickerJson
        }
        this.onActionCallback('details', sticker);
      }
    }
  }
</script>

<style>

.avatar-group {
  max-width: 300px;

}

.text-right {
  width: 100%;
  padding: 0px
}

.fav-cell-btn {
  width: 112px;
  margin: 2px;
}
</style>