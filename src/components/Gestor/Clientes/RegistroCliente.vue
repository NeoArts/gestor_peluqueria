<template>
    <div class="container my-2">
        <div class="border">
            <h4 class="text-center mb-4">Información del Cliente</h4>
            <div class="d-flex flex-wrap">
                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Documento</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="20"
                    v-model="cliente.documento" 
                    v-on:keyup="format(0)"/>
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Afiliado</h6>
                    <input type="text"
                    id="clienteInput"
                    class="form-control border-0 formato-inputs"
                    maxlength="30"
                    v-on:keyup="filtroAfiliado"
                    autocomplete="off"
                    v-model="filtro"/>
                    <div class="border contenedor_opciones hide" id="lista_clientes_input">
                        <p class="my-1 opciones rounded mx-2"
                        v-for="cli in clientes"
                        v-on:click="selectAfiliado(cli)">{{ cli.nombres }} {{ cli.apellidos }}</p>
                    </div>
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Nombres Completos</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="40"
                    v-model="cliente.nombres" />
                </div>
            </div>
            <div class="d-flex flex-wrap">
                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Apellidos Completos</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="40"
                    v-model="cliente.apellidos" />
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Género</h6>
                    <select class="form-select border-0 formato-inputs"
                    v-model="cliente.genero">
                        <option value="m">Masculino</option>
                        <option value="f">Femenino</option>
                        <option value="o">Otro</option>
                    </select>
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Telefono</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="15"
                    v-model="cliente.telefono" 
                    v-on:keyup="format(3)" />
                </div>
            </div>
            <div class="d-flex flex-wrap mb-3">
                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Fecha de Nacimiento</h6>
                    <input type="date"
                     class="form-control border-0 mt-0"
                     id="startDate"
                     v-model="cliente.fechaNacimiento"/>
                </div>

                <div class="p-1 border mx-auto caja text-center my-1" :style="[pantallaGrande ? 'width: 300px;' : '']">
                    <h6 class="border-bottom">correo</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="50"
                    :style="[pantallaGrande ? 'width: 290px;' : '']"
                    v-model="cliente.correo" />
                </div>
            </div>
        </div>
        <!-- <div class="border my-4">
            <h4 class="text-center mb-4">Información de la Cuenta</h4>
            <div class="d-flex flex-wrap">
                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Contraseña</h6>
                    <div class="input-group d-flex">
                        <input type="password"
                         id="password"
                         class="form-control border-0 formato-inputs"
                         maxlength="40"
                         v-model="usuario.Password" />
                        <button class="btn btn-outline-secondary border-0" type="button" v-on:click="cambiarTipo(0)">
                            <i class="fa-solid fa-key" style="color: black;"></i>
                        </button>
                    </div>
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Confirmar Contraseña</h6>
                    <div class="input-group d-flex">
                        <input type="password"
                         id="ConfPass"
                         class="form-control border-0 formato-inputs"
                         maxlength="40"
                         v-model="usuario.ConfPass" />
                        <button class="btn btn-outline-secondary border-0" type="button" v-on:click="cambiarTipo(1)">
                            <i class="fa-solid fa-key" style="color: black;"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="d-flex flex-wrap justify-content-start mt-2">
            <button class="btn btn-success px-3 py-1 mb-4 border" v-on:click="submitForm">
                <h5>Guardar</h5>
            </button>
        </div>
    </div>
</template>

<script>
import { auto } from '@popperjs/core';
import firebase from 'firebase';
import { useStore } from 'vuex';

export default{
    data(){
        return{
            cliente: {
                documento: "",
                CodAfiliado: "",
                nombres: "",
                apellidos: "",
                genero: null,
                telefono: "",
                correo: "",
                rol: "cliente",
                puntos: 0,
                puntosReferidos: 0,
                fechaNacimiento: ""
            },
            usuario:{
                Password: "",
                ConfPass: "",
            },
            clientes: [],
            clientesAux: [],
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            filtro: "",
        }
    },
    beforeMount(){
        this.$swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            width: auto,
            didOpen: () => {
                this.$swal.showLoading();
            }
        })
        try{
            firebase
                .firestore()
                .collection("clientes")
                .get()
                .then((result) => {
                    var lista = []
                    for(var i in result.docs){
                        lista.push(result.docs[i].data().usuario)
                    }
                    this.clientes = lista
                    this.clientesAux = lista
                    this.$swal.close()
                })
        }catch(error){
            console.log(error)
        }
    },
    mounted(){
        const clientes = document.getElementById("clienteInput");
        clientes.addEventListener("focusin", () => {
            const lista = document.getElementById("lista_clientes_input");
            lista.classList.remove("hide");
        })
    },
    methods:{
        format(index){
            if(index === 0){
                var num = this.cliente.documento.replace(/\./g,'');
                if(!isNaN(num)){
                    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                    num = num.split('').reverse().join('').replace(/^[\.]/,'');
                    this.cliente.documento = num;
                }
                else{
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.cliente.documento = this.cliente.documento.replace(/[^\d\.]*/g,'');
                }
            }
            if(index === 1){
                var num = this.cliente.CodAfiliado.replace(/\./g,'');
                if(!isNaN(num)){
                    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                    num = num.split('').reverse().join('').replace(/^[\.]/,'');
                    this.cliente.CodAfiliado = num;
                }
                else{
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.cliente.CodAfiliado = this.cliente.CodAfiliado.replace(/[^\d\.]*/g,'');
                }
            }
            if(index === 3){
                var num = this.cliente.telefono.replace(/\./g,'');
                if(isNaN(num)){
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.cliente.telefono = this.cliente.telefono.replace(/[^\d\.]*/g,'');
                }
            }
        },
        filtroAfiliado(){
            var list = [];
            for(var i in this.clientesAux){
                var nombre = this.clientesAux[i].nombres+" "+this.clientesAux[i].apellidos;
                if(this.clientesAux[i].documento.replaceAll(".","").includes(this.filtro) || nombre.toLowerCase().includes(this.filtro)){
                    list.push(this.clientesAux[i])
                }
            }
            this.clientes = list
        },
        cambiarTipo(index){
            if(index === 0){
                if(document.getElementById("password").type === "password"){
                    document.getElementById("password").type = 'text'
                }else{
                    document.getElementById("password").type = 'password'
                }
            }
            if(index === 1){
                if(document.getElementById("ConfPass").type === "password"){
                    document.getElementById("ConfPass").type = 'text'
                }else{
                    document.getElementById("ConfPass").type = 'password'
                }
            }
        },
        submitForm: async function(){
            var errors = "";

            // if(this.usuario.Password !== this.usuario.ConfPass){
            //     errors = "Las contraseñas no concuerdan"
            // }

            if(!this.isCorreo(this.cliente.correo)){
                errors = "El formato del correo es no es válido"
            }

            if(this.cliente.documento === "" || this.cliente.nombres === "" || this.cliente.apellidos === "" ||
            this.cliente.genero === null || this.cliente.telefono === "" || this.cliente.correo === "" ){
                errors = "Revisa el formulario, no debe haber campos vacios"
            }
            console.log(errors)
            if(errors !== ""){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas en el formulario',
                    text: errors,
                })
            } else {
                this.$swal({
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    width: auto,
                    didOpen: () => {
                        this.$swal.showLoading();
                    }
                })

                // this.registrarCliente(this.cliente.correo, this.usuario.Password)
                // setTimeout(()=>{},2000)             
                this.registrarUsuario(this.cliente)   
                // 
            }
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
        selectAfiliado(cli){
            this.filtro = cli.nombres+" "+cli.apellidos;
            this.cliente.CodAfiliado = cli.documento;
            const lista = document.getElementById("lista_clientes_input");
            lista.classList.add("hide");
        },
        async registrarCliente(correo, password){
            try{
                await firebase
                    .auth()
                    .createUserWithEmailAndPassword(correo, password)
                    .then(async user => {
                        firebase.auth().currentUser.sendEmailVerification().then(() => {
                            this.cliente.uid = user.user.uid
                        })
                    });
                    firebase
                        .auth()
                        .signOut()
                        .then(() => {
                            return true
                        });  
                    return false
            }catch(error){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas registrando el usuario',
                    text: error,
                })
            }
        },
        async registrarUsuario(usuario){
            // console.log(usuario)
            // this.$swal.close()
            try{
                await firebase
                    .firestore()
                    .collection("clientes")
                    .doc(usuario.documento)
                    .set({usuario})
                    .then(() => {
                        this.$swal.close()
                        if(this.store.state.CliComponents !== 0){this.store.state.CliComponents = 0}
                        else{this.store.state.CajaInv = 0}
                    })
            }catch(error){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas registrando el usuario',
                    text: error,
                })
            }
        },
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
.formato-inputs{
    text-align:center;
}
.hide{
    display: none;
}
.opciones{
    cursor: pointer;
}
.opciones:hover{
    background-color: rgb(109, 109, 109);
}
.contenedor_opciones{
    max-height: 115px;
    overflow-y: scroll;
}
</style>