<template>
    <div class="container_empleados border">
        <div class="d-flex justify-content-end m-3" v-if="isAdmin">
            <button type="button" class="btn btn-success"
             v-on:click="registrar">
                <i class="fa-solid fa-plus"></i>
                Registrar
            </button>
        </div>

        <div class="d-flex mb-4 flex-wrap mx-1">
            <p class="my-auto fw-bold">Ingresa el nombre o documento del Barbero</p>
            <input type="text" 
            class="form-control" 
            v-model="filtro"
            v-on:keyup="SoloLetras"
            maxlength="50"/>
        </div>
        <div class="table-responsive" :style="{maxHeight: '250px', maxWidth: computedMaxWidth}">
            <table class="table table-bordered table-hover" v-if="mostrar">
                <thead>
                    <tr class="table-dark">
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Documento
                                <span v-on:click="aplicarSort(0)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Nombre
                                <span v-on:click="aplicarSort(1)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Telefono
                                <span v-on:click="aplicarSort(2)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Correo
                                <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <!-- <th scope="col" v-if="isAdmin"></th> -->
                    </tr>
                </thead>
                <tbody v-for="user in usuarios" >
                    <tr style="vertical-align: middle;" v-on:click="seleccionado(user)">
                        <th scope="row">{{ user.NoIdentificacion }}</th>
                        <td>{{ user.nombres }} {{ user.apellidos }}</td>
                        <td>{{ user.celular }}</td>
                        <td>{{ user.correo }}</td>
                        <!-- <td v-if="isAdmin">
                            <button class="p-0 border-0" v-on:click="editar(''+user.uid)">
                                <i class="fa-solid fa-user-pen icono" ></i>
                            </button>
                        </td> -->
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- <div class="table-responsive" v-else>
            <table class="table table-bordered" v-if="mostrar">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col" v-if="isAdmin"></th>
                    </tr>
                </thead>
                <tbody v-for="user in usuarios" >
                    <tr style="vertical-align: middle;">
                        <th scope="row">{{ user.NoIdentificacion }}</th>
                        <td>{{ user.nombres }} {{ user.apellidos }}</td>
                        <td v-if="isAdmin">
                            <button class="p-0 border-0" v-on:click="editar(''+user.uid)">
                                <i class="fa-solid fa-user-pen icono"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div> -->
    </div>

</template>

<script>
import { auto } from '@popperjs/core';
import firebase from 'firebase';
import { useStore } from 'vuex';

export default{
    beforeMount(){
        this.onResize();
        this.$swal({
            allowEscapeKey: false,
            allowOutsideClick: false,
            width: auto,
            didOpen: () => {
                this.$swal.showLoading();
            }
        })
        firebase
            .firestore()
            .collection("nomina")
            .get()
            .then((result) => {
                var lista = []
                for(var i in result.docs){
                    if(result.docs[i].data().usuario.rol !== "caja"){
                        lista.push(result.docs[i].data().usuario)
                    }
                }
                this.usuarios = lista
                this.usuariosAux = lista
                this.mostrar = true
                this.$swal.close();
            })
        if(this.store.state.user.rol === "admin"){
            this.isAdmin = true
        }
    },
    mounted(){
        this.$nextTick(() => {
            window.addEventListener('resize',this.onResize);
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data(){
        return{
            usuarios: null,
            usuariosAux: null,
            mostrar: false,
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            isAdmin: false,
            filtro: "",
            computedMaxWidth: null,
        }
    },
    methods:{
        SoloLetras(){
            var list = []
            for(var i in this.usuariosAux){
                var nombres = (this.usuariosAux[i].nombres+" "+this.usuariosAux[i].apellidos).toLowerCase()
                if(nombres.includes(this.filtro) || this.usuariosAux[i].NoIdentificacion.includes(this.filtro)){
                    list.push(this.usuariosAux[i])
                }
            }
            this.usuarios = list
        },
        seleccionado(user){
            var cumpleaños = user.fechaNacimiento.split("-")[1]+"/"+user.fechaNacimiento.split("-")[2]
            if(this.store.state.user.rol === "admin"){
                this.$swal({
                    title: "Datos del barbero",
                    html: `
                    <div class="d-flex border flex-column bd-highlight mb-3">
                        <div class="p-2 bd-highlight border">
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Nombre</p>
                                    <p class="my-1">` + user.nombres + ` `+ user.apellidos + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Documento</p>
                                    <p class="my-1">` + user.NoIdentificacion +`</p>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Cumpleaños</p>
                                    <p class="my-1">` + cumpleaños + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Lugar de Nacimiento</p>
                                    <p class="my-1">` + user.LugarNacimiento +`</p>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Dirección</p>
                                    <p class="my-1">` + user.direccion + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Fecha de Contratación</p>
                                    <p class="my-1">` + user.fechaContracion +`</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    showCancelButton: true,
                    showDenyButton: true,
                    confirmButtonText: "Visitas",
                    cancelButtonText: "Editar",
                    denyButtonText: "Confirmar",
                    denyButtonColor: "#32a852",
                    reverseButtons: true
                }).then((result) => {
                    if(result.dismiss === "cancel"){
                        this.editar(user.uid);
                    }
                    if(result.isConfirmed){
                        
                    }
                })
            }
        },
        onResize(){
            this.pantallaGrande = ((window.innerWidth<1000) ? false : true);
            const containerWidth = window.outerWidth - 40;

            this.computedMaxWidth = `${containerWidth}px`;
        },
        registrar(){
            this.$router.push("/register")
        },
        editar(uid){
            this.$router.push("/editEmployee/"+uid)
        },
        aplicarSort(index){
            if(index === 0){
                this.usuarios.sort(function (a, b){
                    return parseInt(a.NoIdentificacion) - parseInt(b.NoIdentificacion)
                })
            }
            if(index === 1){
                this.usuarios = this.usuarios.sort(function(a, b){
                    if(a.nombres >  b.nombres){
                        return 1;
                    }
                    if (a.nombres < b.nombres) {
                        return -1;
                    }
                    return 0;
                });
            }
        },
    },
    setup(){
        const store = useStore()
        var ListaUsuarios = null;

        async function usuarios(){
            var lista = []
            await firebase
                .firestore()
                .collection("nomina")
                .get()
                .then((result) => {
                    // console.log(result.docs)
                    for(var i in result.docs){
                        // console.log(result.docs[i].data().usuario)
                        lista.push(result.docs[i].data().usuario)
                    }
                })
            return lista
            // console.log(ListaUsuarios)
        }

        return{
            usuarios,
            ListaUsuarios,
            store
        }
    },
}
</script>

<style>
.container_empleados{
    background-color: white;
}
.icono{
    cursor: pointer;
}
</style>