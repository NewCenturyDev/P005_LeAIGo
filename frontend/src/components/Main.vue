<template>
  <div class="main">
    <NavBar></NavBar>
    <b-carousel
      id="carousel-1"
      v-model="slide"
      :interval="2000"
      controls
      indicators
      img-width="1024"
      img-height="480"
      style="text-shadow: 1px 1px 2px #333;"
      @sliding-start="onSlideStart"
      @sliding-end="onSlideEnd"
    >
      <b-carousel-slide img-src="Assets/sample1.png"></b-carousel-slide>
      <b-carousel-slide img-src="Assets/sample2.png"></b-carousel-slide>
      <b-carousel-slide img-src="Assets/sample3.png"></b-carousel-slide>
      <b-carousel-slide img-src="Assets/sample4.png"></b-carousel-slide>
    </b-carousel>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
