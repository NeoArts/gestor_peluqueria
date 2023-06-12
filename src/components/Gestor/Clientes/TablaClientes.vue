<template>

    <div class="d-flex mb-4 flex-wrap mx-1">
        <p class="my-auto fw-bold">Ingresa el nombre o documento del Cliente</p>
        <input type="text" 
         class="form-control" 
         v-model="filtro"
         v-on:keyup="SoloLetras"
         maxlength="50"/>
    </div>
    <div class="table-responsive" v-if="mostrar" :style="{maxHeight: '250px', maxWidth: computedMaxWidth}">
        <table class="table table-bordered table-hover" >
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
                            Fecha de nacimiento
                            <span v-on:click="aplicarSort(2)"><i class="fa-solid fa-arrow-down-1-9 icono"></i></span>
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Puntos
                            <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody v-for="cliente in clientes">
                <tr style="vertical-align: middle;" v-on:click="seleccionado(cliente)">
                    <th scope="row">{{ cliente.documento }}</th>
                    <td>{{ cliente.nombres }} {{ cliente.apellidos }}</td>
                    <td>{{ cliente.fechaNacimiento }}</td>
                    <td>{{ cliente.puntos }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { auto } from '@popperjs/core';
import { useStore } from 'vuex';
import firebase from 'firebase';

export default{
    beforeMount(){
        this.calculateMaxWidth();
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
                    // console.log(this.clientes)
                    this.mostrar = true
                    this.$swal.close()
                })
        }catch(error){
            console.log(error)
        }
    },
    mounted(){
        this.$nextTick(() => {
            window.addEventListener("resize", this.calculateMaxWidth);
        });
    },
    beforeUnmount(){
        window.removeEventListener('resize', this.calculateMaxWidth);
    },
    data(){
        return{
            clientes: null,
            clientesAux: null,
            mostrar: false,
            filtro: "",
            filtros: false,
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            computedMaxWidth: null,
        }
    },
    methods: {
        calculateMaxWidth() {
            const containerWidth = window.outerWidth - 40;

            this.computedMaxWidth = `${containerWidth}px`;
        },
        seleccionado(cliente){
            var puntosPersonales = cliente.puntos - cliente.puntosReferidos;
            var cumpleaños = cliente.fechaNacimiento.split("-")[1]+"/"+cliente.fechaNacimiento.split("-")[2];
            // console.log(puntosPersonales);
            if(this.store.state.user.rol === "admin"){
                this.$swal({
                    title: "Datos del cliente",
                    html: `
                    <div class="d-flex border flex-column bd-highlight mb-3">
                        <div class="p-2 bd-highlight border">
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Nombre</p>
                                    <p class="my-1">` + cliente.nombres + ` `+ cliente.apellidos + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Documento</p>
                                    <p class="my-1">` + cliente.documento +`</p>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Cumpleaños</p>
                                    <p class="my-1">` + cumpleaños + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Telefono</p>
                                    <p class="my-1">` + cliente.telefono +`</p>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Puntos Personales</p>
                                    <p class="my-1">` + puntosPersonales + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Telefono</p>
                                    <p class="my-1">` + cliente.puntosReferidos +`</p>
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
                        this.editar(cliente)
                    }
                    if(result.isConfirmed){
                        this.store.state.CliComponents = 3
                        // console.log(cliente.documento);
                        this.store.state.cliEdit = cliente.documento
                    }
                })
            }
        },
        editar(usuario){
            this.store.state.CliComponents = 2
            this.store.state.cliEdit = usuario
            // console.log(usuario)
        },
        SoloLetras(){
            var list = []
            for(var i in this.clientesAux){
                var nombres = (this.clientesAux[i].nombres+" "+this.clientesAux[i].apellidos).toLowerCase()
                if(nombres.includes(this.filtro) || this.clientesAux[i].documento.replaceAll(".", "").includes(this.filtro)){
                    list.push(this.clientesAux[i])
                }
            }
            this.clientes = list
        },
        aplicarSort(index){
            if(index === 0){
                // console.log(this.clientes[0].documento.replaceAll(".",""))
                this.clientes.sort(function(a, b){
                    return parseInt(a.documento.replaceAll(".","")) - parseInt(b.documento.replaceAll(".",""))
                });
            }
            if(index === 1){
                this.clientes.sort(function(a, b){
                    if(a.nombres >  b.nombres){
                        return 1;
                    }
                    if (a.nombres < b.nombres) {
                        return -1;
                    }
                    return 0;
                });
            }
            if(index === 2){
                this.clientes.sort(function(a, b){
                    if(a.fechaNacimiento >  b.fechaNacimiento){
                        return 1;
                    }
                    if (a.fechaNacimiento < b.fechaNacimiento) {
                        return -1;
                    }
                    return 0;
                });
            }
            if(index === 3){
                this.clientes.sort(function(a, b){
                    if(a.puntosReferidos >  b.puntosReferidos){
                        return 1;
                    }
                    if (a.puntosReferidos < b.puntosReferidos) {
                        return -1;
                    }
                    return 0;
                });
            }
        },
    },
    setup(){
        const store = useStore()

        return {
            store
        }
    }
}
</script>

<style>
button{
    background-color: white;
}
span{
    cursor: pointer;
}
</style>