<template>
  <div class="demo">
    <NavBar></NavBar>
    <iframe src="code.html" width="100%" height="850px"></iframe>
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

    }
  }
}
</script>