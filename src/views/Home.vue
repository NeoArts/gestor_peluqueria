<template>
    <div class="contenedor_main">
      <div class="align-center">
        <!-- <Carousel /> -->
      </div>
    </div>
</template>

<script>
import Carousel from '@/components/Carousel/Carousel.vue';
export default {
  components:{
    Carousel
  }
  // data(){
  //       return{
  //           carouselOptions:{
  //               direction: process.env.SITE_DIRECTION,
  //               autoplay: false,
  //               perView: this.$device.isMobileOrTablet ? 4 : 8,
  //               peek: { before: 0, after: 50 }
  //           },
  //           array: [1,2,3,4,5,6,7],
  //           active: 0
  //       }
  //   },
  //   watch:{
  //     active(){
  //       console.log('active = ' + this.active)
  //       if(this.active > this.array.length - 3){
  //         this.array= [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
  //       }
  //     }
  //   },
}
</script>

<style>
.contenedor_main{
    background-image: url('../assets/barberiaFondo.jpeg');
    height: 100vh;
    width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    top: 0;
}
.align-center {
  display: flex;
  justify-content: center;
  top: 120px;
  align-items: center;
  padding: 20px 0 300px;
}
</style>