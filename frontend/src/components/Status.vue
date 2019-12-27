<template>
  <div class="status">
    <NavBar></NavBar>
    <b-button :click="LoadAiStatusList">새로 고침</b-button>
    <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
import Navigation from './units/Navigation';
export default {
  components: {
    'NavBar': Navigation
  },
  data() {
    return{
      items: []
    }
  },
  beforeMount() {
    this.LoadAiStatusList();
  },
  methods: {
    LoadAiStatusList: function () {
      const self = this;
      this.$http.get('/ai/list')
          .then((res => {
            self.items = res.data;
          }))
          .catch(function (err) {
            alert('데이터 로드에 오류가 발생하였습니다\n 오류코드 : ' + err);
            this.$router.push('/');
      })
    },
  }
}
</script>