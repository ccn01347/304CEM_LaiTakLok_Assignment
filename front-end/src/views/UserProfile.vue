<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
                     :style="headerStyle">
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-7 col-md-10">
                        <h1 class="display-2 text-white">Hello {{tempModel.username}}</h1>
                        <p class="text-white mt-0 mb-5">This is your profile page. Your can edit your profile information here.</p>
                        <a href="#" class="btn btn-info" @click="onEditProfile">Edit profile</a>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-4 order-xl-2 mb-5 mb-xl-0">

                    <div class="card card-profile shadow">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
                                    <img v-bind:src="imageUrl ? imageUrl : 'img/icons/account_circle-24px.svg'" class="rounded-circle">
                                 </div>
                            </div>
                        </div>
                        <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                            <div class="d-flex justify-content-between">
                                <base-button size="sm" type="warning" outline class="float-right" @click="onEditAvatar">Edit Avatar</base-button>
                            </div>
                        </div>
                        <div class="card-body pt-0 pt-md-4">
                            <div class="row">
                                <div class="col">
                                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                                        <div>
                                            <span class="heading">{{favlistCount}}</span>
                                            <span class="description">Favourite List</span>
                                        </div>
                                        <div>
                                            <span class="heading">{{uploadCount}}</span>
                                            <span class="description">Uploads</span>
                                        </div>
                                        <!-- <div>
                                            <span class="heading">89</span>
                                            <span class="description">Comments</span>
                                        </div> -->
                                    </div>
                                </div>
                            </div>
                            <div class="text-center">
                                <h3>
                                    {{tempModel.username}}<span class="font-weight-light"></span>
                                </h3>
                                <div class="h5 font-weight-300">
                                    <i class="ni location_pin mr-2"></i>{{tempModel.email}}
                                </div>
                                <!-- <div class="h5 mt-4">
                                    <i class="ni business_briefcase-24 mr-2"></i>Solution Manager - Creative Tim Officer
                                </div> -->
                               <!--  <div>
                                    <i class="ni education_hat mr-2"></i>University of Computer Science
                                </div> -->
                                <hr class="my-4" />
                                <p>{{tempModel.aboutme}}</p>
                                <!-- <a href="#">Show more</a> -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-8 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">My account</h3>
                                </div>
                               <!--  <div class="col-4 text-right">
                                    <a href="#!" class="btn btn-sm btn-primary">Settings</a>
                                </div> -->
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <h6 class="heading-small text-muted mb-4">User information</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="Email address"
                                                        placeholder="jesse@example.com"
                                                        input-classes="form-control-alternative"
                                                        v-model="tempModel.email"
                                                        readonly
                                            />
                                        </div>
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="Username"
                                                        placeholder="Username"
                                                        input-classes="form-control-alternative"
                                                        v-model="tempModel.username"
                                            />
                                        </div>

                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="Change Password"
                                                        placeholder="New Password"
                                                        input-classes="form-control-alternative"
                                                        v-model="tempModel.pwd"
                                                        type="password"
                                            />
                                        </div>
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="Confirmed Password"
                                                        placeholder="Confirmed Password"
                                                        input-classes="form-control-alternative"
                                                        v-model="tempModel.pwd2"
                                                        type="password"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                <hr class="my-4" />
                                <!-- Description -->
                                <h6 class="heading-small text-muted mb-4">About me</h6>
                                <div class="pl-lg-4">
                                    <div class="form-group">
                                        <base-input alternative=""
                                                    label="About Me">
                                            <textarea rows="4" class="form-control form-control-alternative" placeholder="A few words about you ..." v-model="tempModel.aboutme"></textarea>
                                        </base-input>
                                    </div>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>
        <modal :show.sync="showUploadModal">
            <template slot="header">
                <h1 class="modal-title">Upload your Profile Image</h1>
            </template>
            <div>
                <upload-avatar-view @onUploadImageDone="onUploadImageDone"></upload-avatar-view>
            </div>
                <template slot="footer">
            </template>
        </modal>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import Constants from './../Constants.vue'
import UploadAvatarView from './../components/UploadAvatarView.vue'

  export default {
    name: 'user-profile',
    components:{
        UploadAvatarView
    },
    data() {
      return {
        model: {
          username: '',
          email: '',
          pwd: '',
          pwd2: '',
          aboutme: ''
        },
        tempModel:{
          username: '',
          email: '',
          pwd: '',
          pwd2: '',
          aboutme: ''
        },
        imageUrl:'',
        showUploadModal: false,
        favlistCount: 0,
        uploadCount: 0
      }
    },
    mounted(){
        var access_token = Cookies.get("access_token");
        this.imageUrl = Cookies.get("avatarURL");
        if (access_token == undefined){
            this.$alert("You have to login first", "Member Only", "warning").then(() => {
            window.location.href = 'http://localhost:8080/static/'
            })
        }else{
            this.fetchProfile();
            this.fetchUploadCount();
            this.fetchFavCount();
        }

    },
    methods:{
        onEditProfile(){
            var userid = Cookies.get("userid");
            var access_token = Cookies.get("access_token");
            var data = {
                userid: userid,
                access_token: access_token
            };

            if (this.model.username !== this.tempModel.username){
                data.tousername = this.tempModel.username;
            }

            if (this.model.pwd !== this.tempModel.pwd){
                // User may wanna change the password
                // 1. Check the password confirmed
                if (this.tempModel.pwd == this.tempModel.pwd2){
                    data.topwd = this.tempModel.pwd;
                }else{
                    this.$alert("You are trying to change the password but the fields is not matched.", "Warning", "Danger");
                }
            }

            if (this.model.aboutme !== this.tempModel.aboutme){
                data.toaboutme = this.tempModel.aboutme;
            }

            const options = {
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(data)
            };

            const api = Constants.API.Host + '/api/membereditinfo';

            console.log(data);

            fetch(api, options).then((response) => {
                return response.json();
            }).then((result) => {
                console.log(result);
                if (result.status_code == 200){
                    // Edit profile success
                    this.$alert("Profile Updated", "Success", "success").then(() => {
                        this.fetchProfile();
                    });
                }else{
                    this.$alert(result.error, "Error", "warning");
                }
            });



        },
        fetchProfile(){
            var userid = Cookies.get("userid");
            var access_token = Cookies.get("access_token");
            var data = {
                userid: userid,
                access_token: access_token
            };

            const options = {
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(data)
            };

            const api = Constants.API.Host + '/api/memberinfo';
            console.log(data);
            fetch(api, options).then((response) => {
                return response.json();
            }).then((result) => {
                console.log(result);
                if (result.status_code == 200){
                    // Fetch profile success
                    this.model.email    = result.data.email;
                    this.model.pwd      = result.data.pwd;
                    this.model.pwd2     = result.data.pwd;
                    this.model.username = result.data.username;
                    this.model.aboutme  = result.data.aboutme;
                    this.imageUrl       = result.data.avatarURL;

                    Cookies.set("avatarURL", result.data.avatarURL);             
                    Cookies.set("username", result.data.username);
                    this.tempModel = JSON.parse(JSON.stringify(this.model));

                }else{
                    this.$alert(result.error, "Error", "warning");
                }
            });

        },
        fetchUploadCount: function(){
            var userid = Cookies.get("userid");
            const options = {
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
            };
            const api = Constants.API.Host + '/api/favoritelistcount?userid=' + userid;
            fetch(api, options).then((response) => {return response.json()}).then((result) => {
                this.favlistCount = result.data;
            })

        },
        fetchFavCount: function(){
            var userid = Cookies.get("userid");
            const options = {
                method: "GET",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
            };
            const api = Constants.API.Host + '/api/uploadlistcount?userid=' + userid;
            fetch(api, options).then((response) => {return response.json()}).then((result) => {
                this.uploadCount = result.data;
            })
        },
        onEditAvatar(){
            this.showUploadModal = true;
        },
        onUploadImageDone(){
            this.fetchProfile();
            this.showUploadModal = false;
        }

    },
    computed:{
        headerStyle(){
            return "min-height: 600px; background-image: url(" + this.imageUrl + "); background-size: cover; background-position: center top;";
        }
    }
  };
</script>
<style>

</style>
