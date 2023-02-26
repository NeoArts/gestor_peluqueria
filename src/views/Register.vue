<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-auto card">
        <div class="card-body p-1">
          
          <div v-if="!previewImage"
           class="imagePreviewWrapper" 
           :style="{ 'background-image': `url(${require('../assets/icono.png')})` }"
           @click="selectImage"></div>
 
          <div
           class="imagePreviewWrapper"
           v-if="previewImage"
           :style="{ 'background-image': `url(${previewImage})` }"
           @click="selectImage">
          </div>

          <input
           ref="fileInput"
           type="file"
           class="invisible"
           @input="pickFile"
           accept="image/*"/>
          
          <div class="border my-4">

            <h3 class="my-3">Información Personal</h3>

            <div class="d-flex d-flex flex-wrap justify-content-center my-3 align-items-center">

              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Nombres Completos</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs" 
                 maxlength="30"
                 v-model="empleado.nombres"/>
              </div>

              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Apellidos Completos</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="30"
                 v-model="empleado.apellidos"/>
              </div>

              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Fecha de Ingreso</h6>
                <input 
                 v-model="empleado.fechaContracion" 
                 id="startDate"
                 class="form-control border-0" 
                 type="date" />
              </div>

            </div>
            

            <div class=" d-flex flex-wrap justify-content-around my-3">

              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Tipo de Identificación</h6>
                <select class="form-select border-0" aria-label="Default select example"
                 v-model="empleado.tipoIdentificacion">
                  <option value="cc">Cedula</option>
                  <option value="ti">Tarje de Identidad</option>
                  <option value="pp">Pasaporte</option>
                  <option value="ppt">PPT</option>
                </select>
              </div>
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Número de Identificación</h6>
                <input 
                 type="text"
                 class="form-control border-0 formato-inputs"
                 pattern="\d*"
                 v-model="empleado.NoIdentificacion"/>
              </div>

            </div>

            <div class="d-flex mt-2 flex-wrap justify-content-around my-3">
              <div class="p-1 border caja">
                <h6 class="border-bottom">Fecha de Nacimiento</h6>
                <input 
                 id="startDate" 
                 class="form-control border-0" 
                 type="date" 
                 :style="{'width': '15rem'}" 
                 v-model="empleado.fechaNacimiento"/>
              </div>
              <div class="p-1 border caja">
                <h6 class="border-bottom">Lugar de Nacimiento</h6>
                <input 
                 type="text" 
                 class="form-control border-0 formato-inputs" 
                 :style="{'width': '15rem'}" 
                 maxlength="30"
                 v-model="empleado.LugarNacimiento"/>
              </div>
            </div>

            <div class="d-flex mt-2 flex-wrap justify-content-center my-3">
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Dirección de Residencia</h6>
                <input 
                 type="text" 
                 class="form-control border-0 formato-inputs"
                 maxlength="40"
                 v-model="empleado.direccion"/>
              </div>
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Número Celular</h6>
                <input 
                 type="text" 
                 class="form-control border-0 formato-inputs"
                 pattern="\d*" 
                 maxlength="15"
                 v-model="empleado.celular"/>
              </div>
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Correo Electrónico</h6>
                <input 
                 type="text" 
                 placeholder="ejemplo@gmail.com" 
                 class="form-control border-0 formato-inputs" 
                 maxlength="40"
                 v-model="empleado.correo"/>
              </div>
            </div>
            
          </div>

          <div class="border my-2">
            <h3 class="my-3">Información de Contacto</h3>
            <div class="mt-1 d-flex flex-wrap justify-content-around my-3">

              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Nombres Completos</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs" 
                 maxlength="30"
                 :style="{'width': '15rem'}" 
                 v-model="contacto.nombres"/>
              </div>
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Apellidos Completos</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="30"
                 :style="{'width': '15rem'}" 
                 v-model="contacto.apellidos"/>
              </div>

            </div>

            <div class="d-flex mt-2 flex-wrap justify-content-center my-3">
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Dirección de Residencia</h6>
                <input 
                 type="text" 
                 class="form-control border-0 formato-inputs"
                 maxlength="40"
                 v-model="contacto.direccion"/>
              </div>
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Número Celular</h6>
                <input 
                 type="text" 
                 class="form-control border-0 formato-inputs"
                 pattern="\d*" 
                 maxlength="15"
                 v-model="contacto.numero"/>
              </div>
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Correo Electrónico</h6>
                <input 
                 type="text" 
                 placeholder="ejemplo@gmail.com" 
                 class="form-control border-0 formato-inputs" 
                 maxlength="40"
                 v-model="contacto.correo"/>
              </div>
            </div>
            
          </div>

          <div class="border my-2">
            <h3 class="my-3">Información de la Cuenta</h3>
            <div class="mt-1 d-flex flex-wrap justify-content-around my-3">

              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Contraseña</h6>
                <div class="input-group d-flex">
                  <input 
                   type="password"
                   id="password"
                   class="form-control border-0 formato-inputs"
                   maxlength="30"
                   v-model="usuario.contraseña">
                  <button class="btn btn-outline-secondary border-0" type="button" v-on:click="cambiarTipo">
                    <i class="fa-solid fa-key" style="color: black;"></i>
                  </button>
                </div>
              </div>
              <div class="p-1 border mx-2 caja">
                <h6 class="border-bottom">Confirmar Contraseña</h6>
                <div class="input-group d-flex">
                  <input 
                   type="password"
                   id="passwordConf"
                   class="form-control border-0 formato-inputs"
                   maxlength="30"
                   v-model="usuario.contraseñaConf">
                  <button class="btn btn-outline-secondary border-0" type="button" v-on:click="cambiarTipo1">
                    <i class="fa-solid fa-key" style="color: black;"></i>
                  </button>
                </div>
              </div>

            </div>

          </div>

          <div class="d-flex flex-wrap justify-content-around">

            <button class="boton_cancelar px-5 py-1 border my-3" v-on:click="cancelarBoton">
              <h5>Cancelar</h5>
            </button>

            <button class="boton px-5 py-1 border my-3" v-on:click="submitForm">
              <h5>Registrar</h5>
            </button>

          </div>
          
          
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
  import firebase from "firebase";
  import router from "@/router";

  export default {
    data() {
      return {
        errors: "",
        uid: "",
        empleado:{
          nombres: "John Freddy",
          apellidos: "Gomez Florez",
          fechaContracion: "2023-02-21",
          tipoIdentificacion: "cc",
          NoIdentificacion: "1001200804",
          fechaNacimiento: "2023-02-21",
          LugarNacimiento: "Bogotá DC",
          direccion: "Calle 27 bis sur N 12 F-58",
          celular: "3133529828",
          correo: "johnf.gomezf@gmail.com",
          rol: "barbero"
        },
        contacto: {
          nombres: "Mónica del Pilar",
          apellidos: "Florez Agudelo",
          direccion: "Calle 27 bis sur N 12 F-58",
          numero: "3214712690",
          correo: "monicaflorez.agudelo@gmail.com",
        },
        usuario: {
          correo: "",
          contraseña: "1001John",
          contraseñaConf: "1001John",
        },
        previewImage: null,
        image: null,
        iconImage: '../assets/icono.png'
      };
    },    
    methods: {
      submitForm: async function(event){
        this.errors = "";

        if(this.usuario.contraseña !== this.usuario.contraseñaConf){
          this.errors = "Las contraseñas no concuerdan"
        }
        if(!this.isNumber(this.empleado.NoIdentificacion) || !this.isNumber(this.empleado.celular) || !this.isCorreo(this.empleado.correo) || !this.isNumber(this.contacto.numero) || !this.isCorreo(this.contacto.correo)){
          this.errors = "Encontramos formato invalidos en el formulario "
          if(!this.isNumber(this.empleado.NoIdentificacion)){
            this.errors += "(Número de identificación del empleado) "
          }
          if(!this.isNumber(this.empleado.celular)){
            this.errors += "(Número telefónico del empleado) "
          }
          if(!this.isCorreo(this.empleado.correo)){
            this.errors += "(Correo del empleado) "
          }
          if(!this.isNumber(this.contacto.numero)){
            this.errors += "(Número telefónico del contacto) "
          }
          if(!this.isCorreo(this.contacto.correo)){
            this.errors += "(Correo del contacto) "
          }
        }
        if(this.empleado.nombres === "" || this.empleado.apellidos === "" || this.empleado.fechaContracion === null ||
        this.empleado.tipoIdentificacion === "" || this.empleado.NoIdentificacion === "" || this.empleado.fechaNacimiento === null ||
        this.empleado.LugarNacimiento === "" || this.empleado.direccion === "" || this.empleado.celular === "" ||
        this.empleado.correo === "" || this.contacto.nombres === "" || this.contacto.apellidos === "" ||
        this.contacto.direccion === "" || this.contacto.numero === "" || this.contacto.correo === "" ||
        this.usuario.contraseña === "" || this.usuario.contraseñaConf === ""){
          this.errors = "Revisa el formulario, no debe haber campos vacios"
        }
        if(this.errors !== ""){
          this.$swal({
            icon: 'error',
            title: 'Problemas en el formulario',
            text: this.errors
          });
        }
        else if(this.errors === ""){
          this.usuario.correo = this.empleado.correo
          this.$swal({
            icon: 'question',
            title: 'Registrar usuario?',
            text: 'Es la información que ingresaste correcta?',
            html: `
            <div class="d-flex border flex-column bd-highlight mb-3">
              <div class="p-2 bd-highlight border">
                <div class="d-flex justify-content-center p-0">
                  <h5 class="mb-3">`+this.empleado.nombres+` `+this.empleado.apellidos+`</h5>
                </div>

                  <div class="d-flex justify-content-around mb-2 p-0">
                    <div class="m-0">
                      <p class="border-bottom fst-italic m-0">Fecha de Ingreso</p>
                      <p class="my-1">`+this.empleado.fechaContracion+`</p>
                    </div>
                    <div class="m-0">
                      <p class="border-bottom fst-italic m-0">`+this.empleado.tipoIdentificacion+`</p>
                      <p class="my-1">`+this.empleado.NoIdentificacion+`</p>
                    </div>
                  </div>

                  <div class="d-flex justify-content-around mb-2 p-0">
                    <div class="m-0">
                      <p class="border-bottom fst-italic m-0">Nacimiento</p>
                      <p class="my-1">`+this.empleado.fechaNacimiento+`</p>
                    </div>
                    <div class="m-0">
                      <p class="border-bottom fst-italic m-0">Ciudad</p>
                      <p class="my-1">`+this.empleado.LugarNacimiento+`</p>
                    </div>
                  </div>

                  <div class="d-flex justify-content-around mb-2 p-0">
                    <div class="m-0">
                      <p class="border-bottom fst-italic m-0">Dirección</p>
                      <p class="my-1">`+this.empleado.direccion+`</p>
                    </div>
                    <div class="m-0">
                      <p class="border-bottom fst-italic m-0">Número</p>
                      <p class="my-1">`+this.empleado.celular+`</p>
                    </div>
                  </div>

                  <div class="d-flex justify-content-around mb-2 p-0">
                    <div class="m-0">
                      <p class="border-bottom fst-italic m-0">Correo</p>
                      <p class="my-1">`+this.empleado.correo+`</p>
                    </div>
                  </div>

              </div>
              <div class="p-2 bd-highlight border">

                <div class="d-flex justify-content-center p-0">
                  <h5 class="mb-3">`+this.contacto.nombres+` `+this.contacto.apellidos+`</h5>
                </div>

                <div class="d-flex justify-content-around mb-2 p-0">
                  <div class="m-0">
                    <p class="border-bottom fst-italic m-0">Dirección</p>
                    <p class="my-1">`+this.contacto.direccion+`</p>
                  </div>
                  <div class="m-0">
                    <p class="border-bottom fst-italic m-0">Número</p>
                    <p class="my-1">`+this.contacto.numero+`</p>
                  </div>
                </div>

                <div class="d-flex justify-content-around mb-2 p-0">
                  <div class="m-0">
                    <p class="border-bottom fst-italic m-0">Correo</p>
                    <p class="my-1">`+this.contacto.correo+`</p>
                  </div>
                </div>

              </div>
            </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Registrar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
          }).then((result) => {
            if(result.isConfirmed){

              this.registrarUsuario(this.empleado.correo, this.usuario.contraseña);
              setTimeout(() =>{
                this.registrarDatosUsuario(this.empleado);
                this.registrarDatosContacto(this.contacto);
                if(this.image !== null){
                  const name_file = this.uid+"."+this.image.name.split(".")[1]
                  this.subirFoto(this.image, name_file)
                }
                else{
                  this.$swal({
                    icon: 'success',
                    title: 'Bienvenido',
                    text: 'Usuario Registrado'
                  });
                }
                setTimeout(() =>{router.push({ path: '/login' })},2000)
              }, 2000)
              


            } else if (result.dismiss === this.$swal.DismissReason.cancel) {
              this.$swal({
                icon: 'error',
                title: 'Cancelado',
                text: 'El empleado no ha sido registrado'
              })
            }
          });
        }

      },
      cancelarBoton(){
        router.push({ path: '/' })
      },
      cambiarTipo(){
        if(document.getElementById("password").type === "password"){
          document.getElementById("password").type = 'text'
        }else{
          document.getElementById("password").type = 'password'
        }
      },
      cambiarTipo1(){
        if(document.getElementById("passwordConf").type === "password"){
          document.getElementById("passwordConf").type = 'text'
        }else{
          document.getElementById("passwordConf").type = 'password'
        }
      },
      isNumber(aux){
        var numbs = '0123456789'
        for (var i in aux){
          if(!numbs.includes(aux[i])){
            return false;
          }
        }
        return true;
      },
      isCorreo(aux){
        var i = aux.split("@")[1];
        if(i === undefined){
          return false;
        }
        if(!(i.split(".")[0] === "gmail" || i.split(".")[0] === "yahoo" || i.split(".")[0] === "hotmail")){
          return false;
        }
        if(!(i.split(".")[1] === "com" || i.split(".")[1] === "co" || i.split(".")[1] === "es")){
          return false;
        }
        return true;
      },
      selectImage(){
        this.$refs.fileInput.click()
      },
      pickFile (){
        let input = this.$refs.fileInput
        let file = input.files
        this.image = file[0]
        if(file && file[0]){
          let reader = new FileReader
          reader.onload = e => {
            this.previewImage = e.target.result
          }

          reader.readAsDataURL(file[0])
          this.$emit('input', file[0])
        }
      },
      async registrarUsuario() {
        try {
          var {
            user
          } = await firebase
            .auth()
            .createUserWithEmailAndPassword(this.empleado.correo, this.usuario.contraseña)
            .then(async user => {
              this.uid = user.user.uid
              
              firebase.auth().currentUser.sendEmailVerification().then(() => {console.log("email enviado")});
              if(this.image){
                var name_file = this.uid+"."+this.image.name.split(".")[1]
                firebase.auth().currentUser.updateProfile({
                displayName: this.empleado.nombres+" "+this.empleado.apellidos,
                photoURL: ""+name_file
              }).then(() => { console.log("usuario registrado") });
              }else{
                firebase.auth().currentUser.updateProfile({
                  displayName: this.empleado.nombres+" "+this.empleado.apellidos,
                }).then(() => { console.log("usuario registrado") });
              }
            });
          // signout
          firebase
            .auth()
            .signOut()
            .then(() => {
            });      
        } catch (error) {
          // console.log(error.message);
          this.errors = error.message
        }
      },
      async registrarDatosUsuario(usuario){
        try{
          var { 
            user
          } = await firebase
            .firestore()
            .collection("nomina")
            .doc(this.uid)
            .set({usuario})
            .then(() => {
              console.log("datos registrados")
            })
        } catch (error) {
          this.errors = error.message
        }
      },
      async registrarDatosContacto(contacto){
        try{
          var {
            user
          } = await firebase
            .firestore()
            .collection("contacto")
            .doc(this.uid)
            .set({contacto})
            .then(() => {
              console.log("datos de contacto registrados")
            })
        } catch (error) {
          this.errors = error.message
        }
      },
      async subirFoto(image, name_file){
        await firebase
          .storage()
          .ref()
          .child(name_file)
          .put(image)
          .then((snapshot) => {
            console.log("imagen subida")
          })
      },
    },
  };
</script>

<style scoped lang="scss">
  .imagePreviewWrapper {
    border-radius: 5%;
    background-size: 150px;
    background-position: 50%;
    width: 150px;
    height: 150px;
    display: block;
    margin-left: 10%;
    margin-top: 5%;
    cursor: pointer;
    font-size: 16px;
    background-repeat: no-repeat;
  }
  .formato-inputs{
    text-align:center;
  }
  .caja{
    height: 20%;
    width: 250px;
  }
  .boton{
    border-radius: 250px;
    background-image: linear-gradient(to right, rgba(255,0,0,0), rgb(196, 196, 196));
  }
  .boton_cancelar{
    border-radius: 250px;
    background: rgb(2,0,36);
    background: linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(246,197,197,1) 0%, rgba(228,60,60,1) 92%); 
  }
</style>