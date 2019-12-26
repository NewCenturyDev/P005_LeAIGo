<template>
  <div class="hello">
    <b-button @click="clickMe">{{msg}}</b-button>
  </div>
</template>

<script>
export default {
  data(){
    return{
      msg: '테스트'
    }
  },
  methods: {
    clickMe() {
      alert('아나');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
