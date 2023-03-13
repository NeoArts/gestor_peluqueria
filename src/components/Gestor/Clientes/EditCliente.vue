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
                    <h6 class="border-bottom">Documento del Afiliado</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="20"
                    v-model="cliente.CodAfiliado" 
                    v-on:keyup="format(1)"/>
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
                    <h6 class="border-bottom">Edad</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="2"
                    v-model="cliente.edad" 
                    v-on:keyup="format(2)" />
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
            </div>
            <div class="d-flex flex-wrap mb-3">
                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Telefono</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="15"
                    v-model="cliente.telefono" 
                    v-on:keyup="format(3)" />
                </div>

                <div class="p-1 border mx-auto caja text-center my-1" style="width: 300px;">
                    <h6 class="border-bottom">correo</h6>
                    <input type="text"
                    class="form-control border-0 formato-inputs"
                    maxlength="50"
                    style="width: 290px;"
                    v-model="cliente.correo" />
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-start">
            <button class="btn btn-success px-3 py-1 mb-4 border ms-5" v-on:click="submitForm">
                <h5>Guardar</h5>
            </button>
            <button class="btn btn-danger px-3 py-1 mb-4 border ms-5" v-on:click="eliminarCliente">
                <h5>Eliminar</h5>
            </button>
        </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { auto } from '@popperjs/core';
import firebase from 'firebase';

export default{
    beforeMount(){
        // console.log(this.store.state.cliEdit)
        this.cliente = this.store.state.cliEdit
        // console.log(this.cliente)
    },
    data(){
        return{
            cliente: null,
        }
    },
    setup(){
        const store = useStore();

        return{
            store,
        }
    },
    methods: {
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
            if(index === 2){
                var num = this.cliente.edad.replace(/\./g,'');
                if(isNaN(num)){
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.cliente.edad = this.cliente.edad.replace(/[^\d\.]*/g,'');
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
        submitForm: async function(){
            var errors = "";

            if(!this.isCorreo(this.cliente.correo)){
                errors = "El formato del correo es no es válido"
            }

            if(this.cliente.documento === "" || this.cliente.nombres === "" || this.cliente.apellidos === "" ||
            this.cliente.edad === "" || this.cliente.genero === null || this.cliente.telefono === "" ||
            this.cliente.correo === ""){
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

                this.registrarUsuario(this.cliente)
            }
        },
        async eliminarCliente(){
            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                width: auto,
                didOpen: () => {
                    this.$swal.showLoading();
                }
            })
            try{
                await firebase
                    .firestore()
                    .collection("clientes")
                    .doc(this.cliente.documento)
                    .delete()
                    .then(() => {
                        this.$swal.close();
                        this.store.state.CliComponents = 0
                    })
            }catch(error){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas eliminando el usuario',
                    text: error.message,
                })
            }
        },
        async registrarUsuario(usuario){
            try{
                await firebase
                    .firestore()
                    .collection("clientes")
                    .doc(usuario.documento)
                    .set({usuario})
                    .then(() => {
                        this.$swal.close()
                        this.store.state.CliComponents = 0
                    })
            }catch(error){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas registrando el usuario',
                    text: error,
                })
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
    }
}
</script>