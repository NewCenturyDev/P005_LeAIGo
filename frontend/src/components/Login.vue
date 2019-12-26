<template>
  <div class="login">
    <b-card
    title="로그인"
    style="max-width: 300px; margin: 50px auto;">
      <b-form @submit="Login" @reset="GotoMain">
        <b-form-group id="input-group-1" style="margin: 15px 0;" label-for="input-1">
          <b-form-input
          id="input-1"
          v-model="user.userid"
          type="text"
          required
          placeholder="아이디"
        ></b-form-input>
        </b-form-group>
        <b-form-group id="input-group-1" style="margin: 15px 0;" label-for="input-1">
          <b-form-input
          id="input-2"
          v-model="user.userpw"
          type="password"
          required
          placeholder="비밀번호"
          ></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">로그인</b-button>
        <b-button type="reset" variant="primary" style="margin-left: 10px;">취소</b-button>
      </b-form>
      <br/>
      <div>
        <b-link :to="'/auth/register'">[회원가입] 처음 오셨나요?</b-link>
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
        userpw: ''
      }
    }
  },
  methods: {
    //eslint-disable-next-line
    Login: function (event) {
        let self = this;
        this.$http.post('/users/login',{
            user: this.user
        })
        .then((res) => {
            if(res.data.success == 1){
                alert(res.data.message);
                self.Clear();
                self.GotoMain();
                return;
            }
            else{
                alert(res.data.message);
                self.Clear();
                this.$router.go('/auth');
                return;
            }
        })
        .catch(function (err) {
            self.Clear();
            alert(err);
        })
    },
    Clear: function(){
      this.user.userid = '';
      this.user.userpw = '';
    },
    GotoMain: function(){
      this.$router.push('/');
    }
  }
}
</script>