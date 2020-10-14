<template>
    <div class="row justify-content-center">
        
        <div class="col-lg-5 col-md-7">
<!--             <notification :message="helloheelo" :title="abcabcß">NOTICE ABCABCß</notification>
 -->            <div class="card bg-secondary shadow border-0">
                <div class="card-header bg-transparent pb-5">
<!--                     <div class="text-muted text-center mt-2 mb-3"><small>Sign in with</small></div>
 -->                    <!-- <div class="btn-wrapper text-center">
                        <a href="#" class="btn btn-neutral btn-icon">
                            <span class="btn-inner--icon"><img src="img/icons/common/google.svg"></span>
                            <span class="btn-inner--text">Google</span>
                        </a>
                    </div> -->
                    <div class="facebook-login">
                        <v-facebook-login app-id="351626246034642" 
                        @sdk-init="onFbSDKInit"
                        @login="onFbLogined">
                        <span slot="login">Sign in with Facebook</span>
                    </v-facebook-login>
                    </div>
                </div>
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">
                        <small>Or sign in with credentials</small>
                    </div>
                    <form role="form">
                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Email"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.email">
                        </base-input>

                        <base-input class="input-group-alternative"
                                    placeholder="Password"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password">
                        </base-input>

                        <base-checkbox v-model="model.rememberControlclass" class="custom-control-alternative">
                            <span class="text-muted">Remember me</span>
                        </base-checkbox>
                        <div class="text-center">
                            <base-button type="primary" v-on:click="onSignIn" class="my-4">Sign in</base-button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    <a href="#" class="text-light" @click="onForgotPassword"><small>Forgot password?</small></a>
                </div>
                <div class="col-6 text-right">
                    <router-link to="/register" class="text-light"><small>Create new account</small></router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './../Constants'
import Cookies from 'js-cookie'
import VFacebookLogin from 'vue-facebook-login-component'
import FBHelper from "./../FBHelper.js"

  export default {
    name: 'login',
    components: {
        VFacebookLogin
    },
    data() {
      return {
        fbLogin:{
            FB: {},
            scope: {}
        },
        model: {
          email: '',
          password: '',
          rememberControl: false
        }
      }
    },
    // Methods
    methods: {
        onLoginCompleted: function(userInfo){
            var config = { expires: 7 };

            if (this.model.rememberControl){
                Cookies.set('email', this.model.email, config);
                Cookies.set('password', this.model.password, config);
            }
            console.log("STEVE-", userInfo);
            var userId = userInfo._id;
            Cookies.set('userid', userId, config);
            Cookies.set('access_token', userInfo.access_token, config);
            Cookies.set("avatarURL", userInfo.avatarURL);             
            Cookies.set("username", userInfo.username);             

            this.$router.push({path: '/'});
        },
        onSignIn: function(){
            console.log(Constants);
            var body = {
                'email': this.model.email,
                'pwd': this.model.password
            };

            const options = {
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(body)
            };

            const api = Constants.API.Host + "/api/login"

            fetch(api, options).then((response) => {
                return response.json();
            }).then((result) =>{
                if (result.status_code == 200){
                    // Login success
                    this.onLoginCompleted(result.data);
                    
                }else if (result.status_code == 201){
                    // Not verify email
                    this.$alert("Your account is not yet verified", "Notice", "warning");
                }else{
                    this.$alert("Password & email is not correct!", "Warning", "error");
                }
            });
        },
        onForgotPassword: function(){
            this.$prompt("Input your email address.").then(input => {
                // Forget password
                var data = {
                    email: input
                };

                const options = {
                    method: "POST",
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(data)
                };
                fetch('http://localhost:4000/api/forgetpassword',options)
                .then((response) =>{
                    console.log(response);
                    return response.json()
                }).then((result) => {
                    if (result.status_code === 200){
                        // Register success
                        this.$alert("The password is sent to your email. Please check your email box.", "Done", "success");

                    }else{
                        // Failed Register
                        this.$alert(result.error, "Warning", "error");
                    }
                });


                console.log(input);
            })
            // this.$swal({
            //     title: "What is your email address?",
            //     input: 'text',
            //     inputPlaceholder: 'Enter your email address here',
            //     showCloseButton: true,
            // }).then(input => {
            // })
        },
        onFbSDKInit: function({ FB, scope }){
            this.fbLogin.FB = FB;
            this.fbLogin.scope = scope;
            // console.log(scope);
        },
        onFbLogined: function(response){
            console.log(response);
            // var platform = "facebook";
            // var userid = response.authResponse.userID;

            // 1. Get Information from facebook
            var fbToken = response.authResponse.accessToken;
            FBHelper.me(fbToken).then(result => {
                console.log(result);

                // 2. Fb login
                const api = Constants.API.Host + '/api/platformlogin';
                var data = {
                    platform: "facebook",
                    userid: result.id,
                    email: result.email,
                    name: result.name,
                    fbToken: fbToken,
                    avatarURL: result.picture.data.url
                }
                const options = {
                    method: "POST",
                    headers: new Headers({
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }),
                    body: JSON.stringify(data)
                };

                fetch(api, options).then(response => {return response.json()}).then(result => {
                    if (result.status_code == 200){
                        this.onLoginCompleted(result.data);
                    }else if (result.status_code == 201){
                        this.$alert("A verification email has sent to your email address. Please verify your email address", "Notice", "warning");
                    }else{
                        this.$alert("Password & email is not correct!", "Warning", "error");
                    }
                });
            })

            // 2. Login
        }
    },
    mounted(){
        var username = decodeURIComponent(this.$route.query.username);
        var verified = this.$route.query.verified;
        if (verified){
            this.$notifications.notify({
                message:`<i class="ni ni-like-2"></i> Hi ${username}, your account is activated!`,
                type: "danger"
            })
        }
        
    }
  }
</script>
<style>

.facebook-login {
    width: fit-content;
    text-align: center;
    margin: 1em auto;
    display: table;
}
</style>
