<template>
    <div class="contenedor_login" v-if="mostrar">
      <div class="abs-center">
        <div class="d-flex flex-column me-5 mt-5">
          
          <div class="input-group my-3" style="height: 50px; width: 350px; background-color: white; border-radius: 10px;">
            <span class="input-group-text" id="basic-addon1" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; background-color: #585858;">
              <i class="fa-solid fa-user" style="color: aliceblue;"></i>
            </span>
            <input 
             type="text" 
             class="form-control" 
             aria-describedby="basic-addon1" 
             style="border-top-right-radius: 10px; border-bottom-right-radius: 10px;"
             maxlength="40"
             v-model="email">
          </div>

          <div class="input-group my-3" style="height: 50px; width: 350px; background-color: white; border-radius: 10px;">
            <button class="btn btn-outline-secondary boton_password"  id="button-addon1" v-on:click="cambiarTipo">
              <i class="fa-solid fa-key" style="color: aliceblue;"></i>
            </button>
            <input 
             type="password" 
             id="password" 
             class="form-control"
             aria-describedby="basic-addon1" 
             style="border-top-right-radius: 10px; border-bottom-right-radius: 10px;"
             maxlength="40"
             v-on:keypress.enter="IniciarSesion"
             v-model="password">
          </div>

          <button type="button" class="btn btn-success fs-4 fw-bolder fst-italic mt-5 p-0" style="height: 50px; width: 250px; border-radius: 50px; margin: auto;"
           v-on:click="IniciarSesion">
            Success
          </button>
          <button type="button" class="btn btn-secondary mt-3 p-0 fst-italic fw-bolder" style="height: 40px; width: 200px; border-radius: 50px; margin: auto;" 
           v-on:click="RecuperarPassword">
            Recuperar Contraseña
          </button>

        </div>
      </div>
    </div>

    <div class="contenedor_login_pp" v-else>
      <div class="abs-center-pp">
        <div class="d-flex flex-column">

          <div class="input-group mb-3" style="height: 40px; width: 230px; background-color: white; border-radius: 10px;">
            <span class="input-group-text" id="basic-addon1" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; background-color: #585858;">
              <i class="fa-solid fa-user" style="color: aliceblue;"></i>
            </span>
            <input 
             type="text" 
             class="form-control" 
             aria-describedby="basic-addon1" 
             style="border-top-right-radius: 10px; border-bottom-right-radius: 10px;"
             maxlength="40"
             v-model="email">
          </div>

          <div class="input-group my-3" style="height: 40px; width: 230px; background-color: white; border-radius: 10px;">
            <button class="btn btn-outline-secondary boton_password"  id="button-addon1" v-on:click="cambiarTipo">
              <i class="fa-solid fa-key" style="color: aliceblue;"></i>
            </button>
            <input 
             type="password" 
             id="password" 
             class="form-control"
             aria-describedby="basic-addon1" 
             style="border-top-right-radius: 10px; border-bottom-right-radius: 10px;"
             maxlength="40"
             v-on:keypress.enter="IniciarSesion"
             v-model="password">
          </div>

          <button type="button" class="btn btn-success fs-4 fw-bolder fst-italic mt-3 p-0" style="height: 40px; width: 200px; border-radius: 50px; margin: auto;" 
           v-on:click="IniciarSesion">
            Success
          </button>
          <button type="button" class="btn btn-secondary mt-3 p-0 fst-italic fw-bolder" style="height: 40px; width: 200px; border-radius: 50px; margin: auto;"
           v-on:click="RecuperarPassword">
            Recuperar Contraseña
          </button>



        </div>
      </div>
    </div>

    <!-- añadir función de inicio de sesión en el celular tambien -->
  </template>

<script>
import { useStore } from "vuex";
import firebase from "firebase";
import { isIfStatement } from "@babel/types";

export default{
  data(){
    return{
      mostrar: ((window.innerWidth<1000) ? false : true),
      email: '',
      password: '',
    }
  },
  mounted(){
    this.$nextTick(() => {
      window.addEventListener('resize',this.onResize);
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize',this.onResize)
  },
  setup(){
    const store = useStore();

    return{
      store
    }
  },
  methods:{
    onResize(){
      this.mostrar= ((window.innerWidth<1000) ? false : true)
    },
    cambiarTipo(){
      if(document.getElementById("password").type === "password"){
        document.getElementById("password").type = 'text'
      }else{
        document.getElementById("password").type = 'password'
      }
    },
    async RecuperarPassword(){
      const {value: email} = await this.$swal({
        title: 'Recuperar contraseña',
        text: 'Ingresa tu correo para enviar el email de recuperación',
        input: 'email',
        inputPlaceholder: 'ejemplo@gmail.com'
      })

      if(email){
        try{
          await firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(() => {
              this.$swal({
                icon: 'success',
                text: "Mensaje enviado"
              })
            })
          console.log(email)
        }catch(error){
          this.$swal({
            icon: 'error',
            text: error.message
          })
        }
      }
    },
    IniciarSesion: async function(){
      // console.log(this.email)
      try{
        await firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(user =>{
            if(user.user.emailVerified){
              this.store.commit("setAuthenticated",true)
              firebase
                .firestore()
                .collection("nomina")
                .doc(user.user.uid)
                .get()
                .then(data => {
                  if(data.exists){
                    this.store.commit("setUser", data.data().usuario)

                    // console.log(this.store.state.user)

                    if(this.store.state.user.rol === "admin"){
                      this.store.commit("setPhotoName", data.data().usuario.photoName)
                      setTimeout(() => {
                        this.$router.push("/gestor")
                      }, 2000)
                    }
                    if(this.store.state.user.rol === "caja"){
                      this.$router.push("/caja")
                    }
                  }
                })

              this.$swal({
                title: 'Cargando...',
                text: 'Regalanos un momento',
                allowEscapeKey: false,
                allowOutsideClick: false,
                timer: 5000,
                timerProgressBar: true,
                didOpen: () => {
                  this.$swal.showLoading();
                }
              })
              // setTimeout(() => {
              //   this.$router.push("/gestor")
              // }, 2000)
              
            }
            else{
              this.$swal({
                icon: 'error',
                title: 'Lo sentimos!',
                text: 'El email aun no se encuentra verificado'
              });
              user.user.sendEmailVerification();
            }
          })
      }catch(error){
        console.log(error.code)
        this.$swal({
          icon: 'error',
          title: 'Lo sentimos!',
          text: error.message
        });
      }
    },
  }
}
</script>

<style>
  .abs-center {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 10%;
    min-height: 100vh;
    top: 0;
  }
  .abs-center-pp{
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    top: 0;
  }
  .contenedor_login{
    background-image: url('../assets/fondoLogin.jpeg');
    height: 100vh;
    width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    top: 0;
  }
  .contenedor_login_pp{
    background-image: url('../assets/fondoLogin.jpeg');
    height: 100vh;
    width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    top: 0;
  }
  .caja{
    height: 20%;
    width: 250px;
  }
  button:hover{
    background-color: #D3D3D3;
    cursor: pointer;
  }
  .boton_password{
    background-color: #585858;
    border-top-left-radius: 10px; 
    border-bottom-left-radius: 10px;
  }
</style>