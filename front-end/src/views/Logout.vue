<template>
  <div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default{
  name: 'logout',
  mounted(){
    Cookies.remove('userid');
    Cookies.remove('access_token');
    Cookies.remove("avatarURL");
    Cookies.remove("username")

    window.location.href = "http://localhost:8080/static/"
  }
}
</script>