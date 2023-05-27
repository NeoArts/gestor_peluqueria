<template>
    <div class="container_blanco" ref="container">
        <div class="p-3 border d-flex justify-content-between border flex-wrap">
            <div class="p-1 border caja text-center my-1">
                <h6 class="border-bottom">Fecha</h6>
                <input 
                 id="startDate" 
                 class="form-control border-0 formato-inputs" 
                 type="date" 
                 maxlength="30"
                 :style="{'width': '15rem'}"
                 v-on:change="fechaEscogida"
                 v-model="filtro"/>
            </div>

            <button type="button" class="btn" v-on:click="recargar">
                <i class="fa-solid fa-rotate-right"></i>
            </button>
        </div>
        
        <div class="table-responsive mx-auto" v-if="mostrar" :style="{maxHeight: '250px', maxWidth: computedMaxWidth}">
            <table class="table table-bordered table-hover" >
                <thead>
                    <tr class="table-dark">
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Fecha
                                <span v-on:click="aplicarSort(0)"><i class="fa-solid fa-filter icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Hora
                                <span v-on:click="aplicarSort(1)"><i class="fa-solid fa-filter icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Barbero
                                <span v-on:click="aplicarSort(2)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Cliente
                                <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Precio Total
                                <span v-on:click="aplicarSort(4)"><i class="fa-solid fa-arrow-down-1-9 icono"></i></span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody v-for="venta in ventas">
                    <tr style="vertical-align: middle;" v-on:click="seleccionado(venta)">
                        <td>{{ venta.fecha }}</td>
                        <td>{{ venta.hora }}</td>
                        <td>{{ venta.barbero }}</td>
                        <td>{{ venta.cliente.nombres }} {{ venta.cliente.apellidos }}</td>
                        <td v-if="venta.metodoPago === 'ef'">{{ venta.total }} Efectivo</td>
                        <td v-if="venta.metodoPago === 'nq'">{{ venta.total }} Nequi</td>
                        <td v-if="venta.metodoPago === 'qr'">{{ venta.total }} QR bancolombia</td>
                        <td v-if="venta.metodoPago === 'pt'">{{ venta.total }} Puntos</td>
                        <td v-if="venta.metodoPago === 'dv'">{{ venta.total }} Davivienda</td>

                        <!-- <td >{{ venta.total }} {{ venta.metodoPago }}</td> -->

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase';
import { auto } from '@popperjs/core';
import { useStore } from 'vuex';

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
        // console.log(this.store.state.user.rol);
        if(this.store.state.user.rol === "caja"){
            firebase
                .firestore()
                .collection("ventas")
                    .where("fecha", "==", (new Date().toLocaleDateString("fr-CA")))
                    // .orderBy("hora", "asc")
                    .get()
                    .then((result) => {
                        var list = [];
                        for (var i in result.docs) {
                            list.push(result.docs[i].data());
                        }
                        this.ventas = list;
                        this.ventasLista = list;
                        this.mostrar = true
                        this.$swal.close()
                });
        }
        if(this.store.state.user.rol === "admin"){
            firebase
                .firestore()
                .collection("ventas")
                    //.where("fecha", "==", (new Date().toLocaleDateString("fr-CA")))
                    // .orderBy("hora", "asc")
                    .get()
                    .then((result) => {
                        var list = [];
                        for (var i in result.docs) {
                            list.push(result.docs[i].data());
                        }
                        this.ventas = list;
                        this.ventasLista = list;
                        console.log(this.ventas)
                        this.mostrar = true
                        this.$swal.close()
                });
        }
        // if(this.store.state.user.rol === "caja"){
        //     firebase
        //         .firestore()
        //         .collection("ventas")
        //             .where("fecha", "==", (new Date().toLocaleDateString("fr-CA")))
        //             // .orderBy("hora", "asc")
        //             .get()
        //             .then((result) => {
        //                 var list = [];
        //                 for (var i in result.docs) {
        //                     list.push(result.docs[i].data());
        //                 }
        //                 this.ventas = list;
        //                 this.mostrar = true
        //                 this.$swal.close()
        //         });
        // }
        // else{
        //     firebase
        //         .firestore()
        //         .collection("ventas")
        //             // .orderBy("hora", "asc")
        //         .get()
        //         .then((result) => {
        //             var list = [];
        //             for (var i in result.docs) {
        //                 list.push(result.docs[i].data());
        //             }
        //             this.ventas = list;
        //             this.mostrar = true
        //             this.$swal.close()
        //     });
        // }
        
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
            ventas: [],
            ventasLista: [],
            mostrar: false,
            filtro: null,
            computedMaxWidth: null,
        }
    },
    setup(){
        const store = useStore();

        return{
            store
        }
    },
    methods:{
        calculateMaxWidth() {
            // console.log("UwU")
            const containerWidth = window.outerWidth - 40;

            this.computedMaxWidth = `${containerWidth}px`;
            // console.log(`${containerWidth}px`);
        },
        recargar(){
            this.filtro = "";
            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                width: auto,
                didOpen: () => {
                    this.$swal.showLoading();
                }
            })
            if(this.store.state.user.rol === "caja"){
                firebase
                    .firestore()
                    .collection("ventas")
                        .where("fecha", "==", (new Date().toLocaleDateString("fr-CA")))
                        // .orderBy("hora", "asc")
                        .get()
                        .then((result) => {
                            var list = [];
                            for (var i in result.docs) {
                                list.push(result.docs[i].data());
                            }
                            this.ventas = list;
                            this.ventasLista = list;
                            this.mostrar = true
                            this.$swal.close()
                    });
            }
            if(this.store.state.user.rol === "admin"){
                firebase
                    .firestore()
                    .collection("ventas")
                        //.where("fecha", "==", (new Date().toLocaleDateString("fr-CA")))
                        // .orderBy("hora", "asc")
                        .get()
                        .then((result) => {
                            var list = [];
                            for (var i in result.docs) {
                                list.push(result.docs[i].data());
                            }
                            this.ventas = list;
                            this.ventasLista = list;
                            this.mostrar = true
                            this.$swal.close()
                    });
            }
        },
        seleccionado(item){
            if(this.store.state.user.rol === "caja"){
                this.$swal({
                    title: "Datos de la venta",
                    html: `
                    <div class="d-flex border flex-column bd-highlight mb-3">
                        <div class="p-2 bd-highlight border">
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Barbero</p>
                                    <p class="my-1">` + item.barbero + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Cliente</p>
                                    <p class="my-1">` + item.cliente.nombres + ` `+ item.cliente.apellidos +`</p>
                                </div>
                            </div>

                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Metodo de Pago</p>
                                    <p class="my-1">` + item.metodoPago + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Total</p>
                                    <p class="my-1">` + item.total + `</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                })
            }
            if(this.store.state.user.rol === "admin"){
                this.$swal({
                    title: "Datos de la venta",
                    html: `
                    <div class="d-flex border flex-column bd-highlight mb-3">
                        <div class="p-2 bd-highlight border">
                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Barbero</p>
                                    <p class="my-1">` + item.barbero + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Cliente</p>
                                    <p class="my-1">` + item.cliente.nombres + ` `+ item.cliente.apellidos +`</p>
                                </div>
                            </div>

                            <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Metodo de Pago</p>
                                    <p class="my-1">` + item.metodoPago + `</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0 fw-bolder">Total</p>
                                    <p class="my-1">` + item.total + `</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: "Confirmar",
                    cancelButtonText: "Eliminar",
                    reverseButtons: true
                }).then((result) => {
                    this.$swal({
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        width: auto,
                        didOpen: () => {
                            this.$swal.showLoading();
                        }
                    })
                    if(result.isDismissed){
                        var venta = "("+item.fecha+")-("+item.hora+")("+item.cliente.documento+")";
                        firebase
                            .firestore()
                            .collection("ventas")
                            .doc(venta)
                            .delete()
                            .then(() => {
                                var list = [];
                                for(var i in this.ventas){
                                    if((this.ventas[i].fecha === item.fecha) && (this.ventas[i].hora === item.hora) && (this.ventas[i].cliente.documento === item.cliente.documento)){
                                        // console.log("UwU")
                                    }else{
                                        list.push(this.ventas[i]);
                                    }
                                }
                                this.ventas = list
                                list = []
                                for(var i in this.ventasLista){
                                    if((this.ventasLista[i].fecha === item.fecha) && (this.ventasLista[i].hora === item.hora) && (this.ventasLista[i].cliente.documento === item.cliente.documento)){
                                        // console.log("UwU")
                                    }else{
                                        list.push(this.ventasLista[i]);
                                    }
                                }
                                this.ventasLista = list
                                this.$swal.close();
                            })
                    }
                })
            }
            // console.log(item)
            
        },
        aplicarSort(index){
            if(index === 0){
                this.ventas.sort(function(a, b){
                    if(a.fecha > b.fecha){
                        return -1;
                    }
                    if(a.fecha < b.fecha){
                        return 1;
                    }
                    return 0;
                })
            }
            if(index === 1){
                this.ventas.sort(function(a, b){
                    if(a.fecha > b.fecha){
                        return -1;
                    }
                    if(a.fecha < b.fecha){
                        return 1;
                    }
                    else{
                        if(a.hora < b.hora){
                            return 1;
                        }
                        if(a.hora > b.hora){
                            return -1;
                        }
                    }
                })
            }
            if(index === 2){
                this.ventas.sort(function(a, b){
                    if(a.barbero >  b.barbero){
                        return 1;
                    }
                    if (a.barbero < b.barbero) {
                        return -1;
                    }
                    return 0;
                });
            }
            if(index === 3){
                this.ventas.sort(function(a, b){
                    if(a.cliente.nombres >  b.cliente.nombres){
                        return 1;
                    }
                    if (a.cliente.nombres < b.cliente.nombres) {
                        return -1;
                    }
                    return 0;
                });
            }
            if(index === 4){
                this.ventas.sort(function(a, b){
                    if(a.total >  b.total){
                        return 1;
                    }
                    if (a.total < b.total) {
                        return -1;
                    }
                    return 0;
                });
            }
        },
        fechaEscogida(){
            if(this.filtro === ""){
                this.ventas = this.ventasLista
                return ;
            }
            var lista = [];
            for(var i in this.ventasLista){
                if(this.ventasLista[i].fecha === this.filtro){
                    lista.push(this.ventasLista[i]);
                }
            }
            this.ventas = lista;
            console.log(this.filtro);
        },
    }
}
</script>

<style>
.container_blanco{
    background-color: white;
}
.formato-inputs{
    text-align:center;
}
.caja{
    height: 20%;
    width: 250px;
    border-radius: 5px;
}
span{
    cursor: pointer;
}
</style>