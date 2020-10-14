<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-header bg-transparent pb-5">
                    <!-- <div class="text-muted text-center mt-2 mb-3">
                        <small>Sign up with</small>
                    </div> -->
                   <!--  <div class="btn-wrapper text-center">
                        <a href="#" class="btn btn-neutral btn-icon">
                            <span class="btn-inner--icon"><img src="img/icons/common/github.svg"></span>
                            <span class="btn-inner--text">Github</span>
                        </a>
                        <a href="#" class="btn btn-neutral btn-icon">
                            <span class="btn-inner--icon"><img src="img/icons/common/google.svg"></span>
                            <span class="btn-inner--text">Google</span>
                        </a>
                    </div> -->
                    <div class="facebook-login">
                        <v-facebook-login app-id="351626246034642" 
                        @sdk-init="onFbSDKInit"
                        @login="onFbLogined"
                        >
                        <span slot="login">Sign up with Facebook</span>
                    </v-facebook-login>
                    </div>
                </div>
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">
                        <small>Or sign up with credentials</small>
                    </div>
                    <form role="form">

                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Name"
                                    addon-left-icon="ni ni-hat-3"
                                    v-model="model.name">
                        </base-input>

                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Email"
                                    addon-left-icon="ni ni-email-83"
                                    v-model="model.email">
                        </base-input>

                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Password"

                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password">
                        </base-input>

                        <base-input class="input-group-alternative mb-3"
                                    placeholder="Confirm Password"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    v-model="model.password2"
                                    >
                        </base-input>

                        <div class="text-muted font-italic">
                            <small>password strength: 
                                <span v-if="passwordValidation.errors.length <= 0" class="text-success font-weight-700">strong</span>
                                <span v-if="passwordValidation.errors.length > 0" class="text-danger font-weight-700">weak</span>
                            </small>
                            <transition name="hint" appear>
                                <div v-if='passwordValidation.errors.length > 0 && this.model.password.length > 0' class='hints'>
                                    <p class="text-warning font-weight-700" v-for='error in passwordValidation.errors' v-bind:key="error">- {{error}}</p>
                                </div>
                            </transition>
                        </div>

                        <div class="row my-4">
                            <div class="col-12">
                                <base-checkbox class="custom-control-alternative" v-model="model.checkbox">
                                    <span class="text-muted">I agree with the <a href="#!">Privacy Policy</a></span>
                                </base-checkbox>
                            </div>
                        </div>
                        <div class="text-center">
                            <base-button v-on:click.native="onSignUp" type="primary" class="my-4">Create account</base-button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-6">
                    <a href="#" class="text-light" @click="onForgotPassword"><small>Forgot password?</small></a>

                </div>
                <div class="col-6 text-right">
                    <router-link to="/login" class="text-light">
                        <small>Login into your account</small>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Constants from './../Constants'
import VFacebookLogin from 'vue-facebook-login-component'
import FBHelper from "./../FBHelper.js"
import Cookies from 'js-cookie'

  export default {
    name: 'register',
    components:{ VFacebookLogin },
    data() {
      return {
        model: {
          name: '',
          email: '',
          password: '',
          password2: '',
          checkbox: false,
          errors: []
        },
        fbLogin:{
            FB: {},
            scope: {}
        },
        valid: true,
        value: true,
        rules: [
                { message:'One lowercase letter required.', regex:/[a-z]+/ },
                { message:"One uppercase letter required.",  regex:/[A-Z]+/ },
                { message:"8 characters minimum.", regex:/.{8,}/ },
                { message:"One number required.", regex:/[0-9]+/ }
            ],
        passwordVisible:false,
        submitted:false
        }
    },
    methods: {
        onSignUp: function(event){
            event.preventDefault();
            if (this.model.name === ''){
                this.$alert("Please input your name.", "Notice", 'warning');
                return;
            }
            if (this.passwordValidation.errors.length > 0){
                this.$alert("Please set your password again", "Notice", "info");
                return;
            }

            if (this.model.password !== this.model.password2){
                this.$alert("Password is not match", "Warning", "error");
                return;
            }

            if (this.model.checkbox == false){
                this.$alert("You havd to aceept the policy to create an account.", "Notice", "info");
                return;
            }
            var data = {
                'email': this.model.email,
                'username': this.model.name,
                'pwd': this.model.password
            };

            const options = {
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(data)
            };
            fetch('http://localhost:4000/api/signup',options)
            .then((response) =>{
                console.log(response);
                return response.json()
            }).then((result) => {
                if (result.status_code === 200){
                    // Register success
                    this.$alert("You will reveiced an email to verify the account.", "Registration Success", "success");

                }else{
                    // Failed Register
                    this.$alert(result.error, "Warning", "error");
                }
            });
        },
        onForgotPassword: function(){
            console.log("onForgotPassword");
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
                    console.log(result);
                    if (result.status_code == 200){
                        this.onFacebookSignupComplete(result.data);
                        // this.$alert("You will reveiced an email to verify the account.", "Registration Success", "success");
                    }else if (result.status_code == 201){
                        this.$alert("You will reveiced an email to verify the account.", "Registration Success", "success");
                    }else{
                        this.$alert("Password & email is not correct!", "Warning", "error");
                    }
                });
            })

            // 2. Login
        },
        onFacebookSignupComplete: function(userInfo){
            var config = { expires: 7 };

            var userId = userInfo._id;
            Cookies.set('userid', userId, config);
            Cookies.set('access_token', userInfo.access_token, config);
            Cookies.set("avatarURL", userInfo.avatarURL);             
            Cookies.set("username", userInfo.username);             

            this.$router.push({path: '/'});
        }
    },
    computed:{
        notSamePasswords () {
            if (this.passwordsFilled) {
                return (this.model.password !== this.model.password2)
            } else {
                return false
            }
        },
        passwordsFilled () {
            return (this.model.password !== '' && this.model.password2 !== '')
        },
        passwordValidation () {
            let errors = []
            for (let condition of this.rules) {
                if (!condition.regex.test(this.model.password)) {
                    errors.push(condition.message)
                }
            }
            if (errors.length === 0) {
                return { valid:true, errors }
            } else {
                return { valid:false, errors }
            }
        }
    }
  }
</script>
<style>

.hints {
    max-width:400px;
    padding:1em;
    background:whitesmoke;
    margin: 1em 0;
    font-size: .9em;
    color:darken(#D4DEDF, 50%);
    h2 {
        margin: .5em 0 .2em 0;
    }
    p {
        margin: 0;
        padding-left:1em;
        &::before {
            content:">";
            font-size:.9em;
            margin-right:6px;
            display:inline-block;
        }
    }
}
.hint {
    &-enter {
        opacity:0;
        transform:translate3d(-20px,0,0);
    }
    &-leave-to {
        opacity:0;
        transform:translate3d(0, 20px, 0);
    }
    &-enter-active {
        transition:300ms;
    }
    &-leave-active {
        transition:400ms;
    }
}


.facebook-login {
    width: fit-content;
    text-align: center;
    margin: 1em auto;
    display: table;
}


</style>
