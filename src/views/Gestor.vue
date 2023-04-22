<template>
  <div v-if="mostrar">

    <div class="contenedor_principal_gestor">
      <div class="contenido_gestor_pg border mx-5 rounded-3 border-5" v-if="pantallaGrande">
        <div class="m-5">

          <div class="d-flex">
            <img id="myimg" class="border imagePreviewWrapper my-5 ms-5" src="../assets/icono.png">
            <div class="d-flex flex-column my-5 me-5 container">
              <h1 class="ms-auto mx-auto mt-auto text-center">{{ store.state.user.nombres }} {{ store.state.user.apellidos }}</h1>
              <h5 v-i class="mx-auto mb-auto" id="rol">{{store.state.user.rol}}</h5>
            </div>
          </div>

          <div class="border p-0">
            <nav class="nav">
              <!-- <a class="nav-link active" aria-current="page" href="#">Active</a> -->
              <router-link to="/gestor" class="nav-link active link_pg border border-bottom-0" :class="{ link_pg_activo: (this.$route.path === '/gestor') }">Caja</router-link>
              <router-link to="/gestor/clientes" class="nav-link active link_pg border border-bottom-0" :class="{ link_pg_activo: (this.$route.path === '/gestor/clientes') }">Clientes</router-link>
              <router-link to="/gestor/empleados" class="nav-link active link_pg border border-bottom-0" :class="{ link_pg_activo: (this.$route.path === '/gestor/empleados') }">Empleados</router-link>
              <router-link to="/gestor/inventario" class="nav-link active link_pg border border-bottom-0" :class="{ link_pg_activo: (this.$route.path === '/gestor/inventario') }">Inventario</router-link>
              <router-link to="/gestor/servicios" class="nav-link active link_pg border border-bottom-0" :class="{ link_pg_activo: (this.$route.path === '/gestor/servicios') }">Servicios</router-link>
            </nav>
            <router-view></router-view>
          </div>

        </div>

      </div>

      <div v-else class="contenido_gestor_pp border mx-2 rounded-3 border-5 d-flex flex-column justify-content-center">
        <img src="../assets/icono.png" class="border imagePreviewWrapper my-3" id="myimg" style="height: 130px; width: 130px;">
        <h1 class="ms-auto mx-auto text-center">{{ store.state.user.nombres }} {{ store.state.user.apellidos }}</h1>
        <h5 class="mx-auto mb-3 fst-italic text-decoration-underline" id="rol">{{store.state.user.rol}}</h5>

        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
            {{ link_act }}
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <li><button class="dropdown-item" type="button" v-on:click="cambiarLink('Home')"><router-link to="/gestor" class="link_pp text-decoration-none">Caja</router-link></button></li>
            <li><button class="dropdown-item" type="button" v-on:click="cambiarLink('Clientes')"><router-link to="/gestor/clientes" class="link_pp text-decoration-none">Clientes</router-link></button></li>
            <li><button class="dropdown-item" type="button" v-on:click="cambiarLink('Empleados')"><router-link to="/gestor/empleados" class="link_pp text-decoration-none">Empleados</router-link></button></li>
            <li><button class="dropdown-item" type="button" v-on:click="cambiarLink('Inventario')"><router-link to="/gestor/inventario" class="link_pp text-decoration-none">Inventario</router-link></button></li>
            <li><button class="dropdown-item" type="button" v-on:click="cambiarLink('Servicios')"><router-link to="/gestor/servicios" class="link_pp text-decoration-none">Servicios</router-link></button></li>
          </ul>
        </div>

        <div class="border p-1">
          <!-- <nav class="nav">
            <a class="nav-link active" aria-current="page" href="#">Active</a>
            <router-link to="/gestor" class="nav-link active px-2 py-1 border border-bottom-0 link_pp" :class="{ link_pg_activo: (this.$route.path === '/gestor') }">Home</router-link>
            <router-link to="/gestor/clientes" class="nav-link active px-2 py-1 border border-bottom-0 link_pp" :class="{ link_pg_activo: (this.$route.path === '/gestor/clientes') }">Clientes</router-link>
            <router-link to="/gestor/empleados" class="nav-link active px-2 py-1 border border-bottom-0 link_pp" :class="{ link_pg_activo: (this.$route.path === '/gestor/empleados') }">Empleados</router-link>
            <router-link to="/gestor/inventario" class="nav-link active px-2 py-1 border border-bottom-0 link_pp" :class="{ link_pg_activo: (this.$route.path === '/gestor/inventario') }">Inventario</router-link>
            <router-link to="/gestor/servicios" class="nav-link active link_pg border border-bottom-0 link_pp" :class="{ link_pg_activo: (this.$route.path === '/gestor/servicios') }">Servicios</router-link>
          </nav> -->
          <router-view></router-view>
        </div>
      </div>

    </div>
  </div>

  </template>

<script>
import { useStore } from 'vuex';
import firebase from 'firebase';

export default {

  beforeMount(){
    try{
      if(this.store.state.isAuthenticated === false){
        this.mostrar = false
        this.$swal({
          icon: 'error',
          title: 'Tenemos un problema',
          text: 'Ha ocurrido un problema, lo sentimos',
          confirmButtonText: 'Volver'
        }).then(() => {
          this.$router.push("/")
        })
      }
      console.log(this.store.state.photoName)
      if(this.store.state.photoName !== null){
        console.log(this.store.state.photoName)
        firebase
          .storage()
          .ref()
          .child(this.store.state.photoName)
          .getDownloadURL()
          .then(url => {
            const img = document.getElementById("myimg")
            this.urlPhoto = url
            img.setAttribute('src', url)
          })
      }
    }catch(error){
      console.log(error)
    }
  },
  mounted(){
    this.$nextTick(() => {
      window.addEventListener('resize',this.onResize);
    })
    
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    this.closeInterval()
  },

  data(){
    return{
      mostrar: true,
      pantallaGrande: ((window.innerWidth<1000) ? false : true),
      urlPhoto: null,
      link_act: "Home",
    }
  },

  methods:{
    onResize(){
      this.pantallaGrande = ((window.innerWidth<1000) ? false : true)
      if(this.urlPhoto){
        this.setPhoto();
      }
    },
    cambiarLink(link){
      this.link_act = link
    },
  },

  setup(){
    const store = useStore()

    function setPhoto(){
      if(this.store.state.photoName !== null){
        firebase
          .storage()
          .ref()
          .child(this.store.state.photoName)
          .getDownloadURL()
          .then(url => {
            const img = document.getElementById("myimg")
            this.urlPhoto = url
            img.setAttribute('src', url)
          })
      }
    }

    return{
      store,
      setPhoto,
    }
  }
}

</script>
  
<style>
  .contenedor_principal_gestor{
    background-image: url('../assets/fondoGestor.jpg');
    min-height: 100vh;
    min-width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    top: 0;
  }
  .contenido_gestor_pg{
    margin-top: 140px;
    background: rgba(255, 255, 255, 0.6);
  }
  .contenido_gestor_pp{
    margin-top: 95px;
    background: rgba(255, 255, 255, 0.6);
  }
  .imagePreviewWrapper {
    border-radius: 5%;
    background-position: 50%;
    width: 200px;
    height: 200px;
    background-repeat: no-repeat;
    background-position: center;
    margin-left: auto;
    margin-right: auto;
  }
  .link_pp{
    color: black;
  }
  .link_pg:hover{
    background-color: rgb(136, 136, 136);
  }
  .link_pg{
    border-top-right-radius: 20%;
    border-top-left-radius: 20%;
    background-color: rgb(199, 199, 199);
    color: black;
  }
  .link_pg:hover{
    background-color: rgb(136, 136, 136);
    color: black;
  }
  .link_pg_activo{
    background-color: white;
  }
</style>