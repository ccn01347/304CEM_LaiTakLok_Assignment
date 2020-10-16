<template>
  <div>
    <div class="flex-wrap">
      <div v-for="sticker in stickers" :key="sticker.image_data">
        <img class="grid-img" v-bind:src="base64ToPng(sticker.image_data)"/>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: "sticker-grid-56",
  props:{
    stickers: {
      type: Array,
      default: function(){
        return [];
      }
    }
  },
  methods:{
    base64ToPng: function(imageBytes){
      return 'data:image/png;base64,' + imageBytes;
    },
  },
  mounted(){

  }
}
</script>

<style>
.flex-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: transparent;
}

.flex-wrap > div {
  background-color: #f1f1f1;
  width: 80px;
  margin: 4px;
  text-align: center;
  line-height: 75px;
  font-size: 30px;
}

.flex-wrap .grid-img{
  max-width: 100%;
  max-height: 100%;
  display: block
}
</style>