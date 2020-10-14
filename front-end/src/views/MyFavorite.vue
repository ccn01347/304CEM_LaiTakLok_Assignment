<template>
  <div>
    <dashboard-navbar :showSearch="false"></dashboard-navbar>

    <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">

    </base-header>
    <div class="container-fluid mt--7">
        <div class="row">
            <div class="col">
                <my-favorite-table title="Light Table"></my-favorite-table>
            </div>
        </div>
    </div>
    
  </div>
</template>

<script>

import MyFavoriteTable from './Tables/MyFavoriteTable'
import Cookies from 'vue-cookie';
import DashboardNavbar from './../layout/DashboardNavbar.vue';


export default{
  name: "myfavourite",
  components:{
    MyFavoriteTable,
    DashboardNavbar
  },
  mounted(){
    var access_token = Cookies.get("access_token");
    if (access_token == undefined){
      this.$alert("You have to login first", "Member Only", "warning").then(() => {
        window.location.href = 'http://localhost:8080/static/'
      });
    }
  }


}
</script>