<template>
  <div class="login">
    <b-card
    title="회원가입"
    style="max-width: 300px; margin: 50px auto;">
      <b-form @submit="Register" @reset="GotoMain">
        <b-form-group id="input-group-1" style="margin: 15px 0;" label-for="input-1">
          <b-form-input
          id="input-1"
          v-model="user.userid"
          type="text"
          required
          placeholder="아이디"
        ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-2" style="margin: 15px 0;" label-for="input-1">
          <b-form-input
          id="input-2"
          v-model="user.userpw"
          type="password"
          required
          placeholder="비밀번호"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-3" style="margin: 15px 0;" label-for="input-1">
          <b-form-input
          id="input-3"
          v-model="user.userpwck"
          type="password"
          required
          placeholder="비밀번호 확인"
          ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-4" style="margin: 15px 0;" label-for="input-1">
          <b-form-input
          id="input-4"
          v-model="user.nick"
          type="text"
          required
          placeholder="닉네임"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">회원가입</b-button>
        <b-button type="reset" variant="primary" style="margin-left: 10px;">취소</b-button>
      </b-form>
      <br/>
      <div>
        <b-link :to="'/auth'" style="margin-right: 10px;">[로그인] 이미 가입하셨나요?</b-link>
      </div>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return{
      user: {
        userid: '',
        userpw: '',
        userpwck: '',
        nick: ''
      }
    }
  },
  methods: {
    Register: function () {
      let self = this;
      this.$http.post('/users/signup',{
          user: this.user
      })
      .then((res) => {
          if(res.data.success == 1){
              alert(res.data.message);
              self.clear();
              this.$router.push({path: '/auth'});
          }
          else{
              alert(res.data.message);
              this.$router.push({path: '/auth/register'});
          }
      })
      .catch(function (err) {
          alert(err);
      })
    },
    Clear: function(){
      this.user.userid = '';
      this.user.userpw = '';
    },
    GotoMain: function(){
      this.$router.push({path: '/'});
    }
  }
}
</script>