<template>
  <!-- <Sidebar />
  <div :style="{ 'marging-left' : sidebarWidth }">
    <router-view/>
  </div> -->

  <!-- <div  ref="target"></div>
  <div class="sticky-menu" :class="{ sticking }">This is our sticky menu</div> -->

  <Navbar />
  <router-view/>

</template>

<script>
import { onMounted, ref } from 'vue';
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import { sidebarWidth } from '@/components/Sidebar/state';
import Navbar from './components/Navbar/Navbar.vue';

export default {
  components: {Sidebar, Navbar},
  setup(){
    // return { sidebarWidth }
    // const target = ref();
    // const sticking = ref(false);

    // const observer = new IntersectionObserver(
    //   ([entry]) => { 
    //     sticking.value = !entry.isIntersecting;
    //   },
    //   { threshold: 0.0 }
    // );

    // onMounted(() => {
    //   observer.observe(target.value)
    // });

    return {
      // target,
      // sticking
    };
  }
}
</script>

<style lang="scss">
// #app {
//   min-height: 150vh;
//   background: rgb(2,0,36);
//   background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(69,69,69,1) 0%, rgba(0,0,0,1) 100%);
// }

#app{
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(69,69,69,1) 0%, rgba(0,0,0,1) 100%);
}

.sticky-menu {
  transition: 100ms;
  position: absolute;
  z-index: 1;
  top: 0;
  background-color: #41b883;
  padding: 1rem;
  height: 70px;
}

.sticky-menu.sticking {
  transition: 150ms;
  background-color: rgba(65,184,131,0.1);
  box-shadow: 0px 15px 10px -15px #111;
}

body{
  background: rgb(2,0,36);
  background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(69,69,69,1) 0%, rgba(0,0,0,1) 100%);
}

</style>
