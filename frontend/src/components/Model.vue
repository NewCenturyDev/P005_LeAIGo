<template>
  <div class="model">
    <NavBar></NavBar>
    <div>
      <b-form-textarea
      id="textarea"
      v-model="request.task"
      placeholder="옵션을 입력하십시오. 옵션은 엔터로 구분합니다"
      rows="5"
      max-rows="20"
      ></b-form-textarea>
      <b-form-checkbox
      id="checkbox-1"
      v-model="request.isArdu"
      name="checkbox-1"
      value="1"
      unchecked-value="0"
    >
      아두이노로 실행합니까?
    </b-form-checkbox>
    <b-form-checkbox
      id="checkbox-2"
      v-model="request.isTest"
      name="checkbox-2"
      value="1"
      unchecked-value="0"
    >
      테스트만 진행합니까? (체크를 해제해야 학습합니다.)
    </b-form-checkbox>
    <button @click="ExecuteAI">실행</button>
    </div>
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
      request: {
        task: '',
        isArdu: '0',
        isTest: '0'
      }
    }
  },
  methods: {
    ExecuteAI: function () {
      if(this.request.task === ''){
        alert('옵션은 공란일 수 없습니다.');
        return;
      }

      this.$http.post('/ai/request', {
        request: this.request
      })
        .then((res => {
          if(res.data.success == 1){
            alert('요청이 전송되었습니다\n' + this.request);
          }
          else{
            alert('오류');
          }
        }))
        .catch(function (err) {
          alert('데이터 적재에 오류가 발생하였습니다\n 오류코드 : ' + err);
          this.$router.push('/');
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
