<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand :to="'/'">인공지능 블록코딩</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item :to="'/demo'">인공지능 맛보기</b-nav-item>
          <b-nav-item :to="'/model'">인공지능 다뤄보기</b-nav-item>
          <b-nav-item :to="'/status'">인공지능 상황판</b-nav-item>

          <b-nav-item-dropdown text="커뮤니티" right>
            <b-dropdown-item :to="'/board1'">게시판1</b-dropdown-item>
            <b-dropdown-item :to="'/board2'">게시판2</b-dropdown-item>
            <b-dropdown-item :to="'/board3'">게시판3</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-button @click="GotoSearch" disabled style="margin-left: 10px" size="sm" class="my-2 my-sm-0">Search</b-button>
          <b-button @click="GotoLogin" disabled style="display: inline-block; margin-left: 10px" size="sm" class="my-2 my-sm-0">Login / Logout</b-button>
          <b-button @click="GotoRegister" disabled style="display: inline-block; margin-left: 10px" size="sm" class="my-2 my-sm-0">Register</b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      islogin: false
    }
  },
  methods: {
    GotoSearch: function () {
      alert('검색 기능은 백엔드는 구현이 완료되었으나 프론트엔드 구현 준비중입니다.');
      //this.$router.push('/search');
    },
    GotoLogin: function () {
      let self = this;
      this.$http.get('/users/check')
      .then((res) => {
          if(res.data.islogin == true){
            this.$http.get('/users/logout')
            .then((res) => {
                if(res.data.success == 1){
                    alert(res.data.message);
                    this.$router.go('/');
                }
            })
            .catch(function (err) {
                alert(err);
            })
          }
          else{
            self.$router.push('/auth');
          }
      })
      .catch(function (err) {
          alert(err);
      })
    },
    GotoRegister: function () {
      this.$router.push({path: '/auth/register'});
    }
  }
}
</script>