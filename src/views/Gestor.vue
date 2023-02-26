<template>
    <div class="contenedor_principal_gestor">
      <div class="contenido_gestor_pg border mx-5 rounded-3 border-5">
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
              <router-link to="/gestor" class="nav-link active">Home</router-link>
              <router-link to="/gestor/clientes" class="nav-link active">Clientes</router-link>
              <router-link to="/gestor/empleados" class="nav-link active">Empleados</router-link>
              <router-link to="/gestor/inventario" class="nav-link active">Inventario</router-link>
            </nav>
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
      if(this.store.state.photoName !== null){
        firebase
          .storage()
          .ref()
          .child(this.store.state.photoName)
          .getDownloadURL()
          .then(url => {
            const img = document.getElementById("myimg")
            img.setAttribute('src', url)
          })
      }
    }catch(error){}
  },

  setup(){
    const store = useStore()

    return{
      store
    }
  }
}

</script>
  
<style>
  .contenedor_principal_gestor{
    background-image: url('../assets/fondoGestor.jpg');
    height: 100vh;
    width: 100%;
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
  .imagePreviewWrapper {
    border-radius: 5%;
    background-position: 50%;
    width: 200px;
    height: 200px;
    background-repeat: no-repeat;
    background-position: center;
  }
</style>