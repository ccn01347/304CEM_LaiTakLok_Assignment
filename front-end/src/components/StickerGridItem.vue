<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-2"><img v-bind:src="base64ToPng(this.stickerJson.stickers[0].image_data)" class="sticker-grid-image"/></div>
      <div class="col-xs-2"><img v-bind:src="base64ToPng(this.stickerJson.stickers[1].image_data)" class="sticker-grid-image"/></div>
    </div>
    <div class="row">
      <div class="col-xs-2"><img v-bind:src="base64ToPng(this.stickerJson.stickers[2].image_data)" class="sticker-grid-image"/></div>
      <div class="col-xs-2"><img v-bind:src="base64ToPng(this.stickerJson.stickers[3].image_data)" class="sticker-grid-image"/></div>
    </div>
    
    <slot></slot>
  </div>
</template>

<script>
  export default{
    name: 'sticker-grid-item',
    props: {
      stickerJson: {
        type: Object,
        default: () => {
          return null;
        }
      },
      index: {
        type: Number
      }
    },
    components:{
    },
    computed:{
      base64Image: function(){
        return 'data:image/png;base64,' + this.sticker.image_data;
      }
    },
    methods:{
      base64ToPng(imageData){
        return 'data:image/png;base64,' + imageData;
      }
    }
  }
</script>

<style>
@keyframes shake {
  from {
    transform: rotate(-4deg);
  },
  to {
    transform: rotate(4deg);
  }
}

.container{
  position: relative;
  margin: 12px;
  height: 148px;
  width: 148px;
  border-radius: 10px;
  box-shadow: 0px 6px 20px rgba(0, 0, 0, 0.07);
  color: #666;
  text-align: center;
  font-weight: 900;
  font-size: 12px;
  transition: all 0.2s;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: center;
  justify-self: center;

}

.container .col-xs-2{
  display: block;
  margin:auto;
}
.sticker-grid-image {
  width: 50px;
  height: auto;
}
.v-grid-item-dragging .container {
  animation-name: shake;
  animation-duration: 0.07s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}
</style>
