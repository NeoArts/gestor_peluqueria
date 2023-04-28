<template>
    <div class="table-responsive" v-if="mostrar" :style="{maxHeight: '250px'}">
        <table class="table table-bordered table-hover" >
            <thead>
                <tr class="table-dark">
                    <th scope="col" class="py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            Fecha
                        </div>
                    </th>
                    <th scope="col" class="py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            Hora
                        </div>
                    </th>
                    <th scope="col" class="py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            Barbero
                        </div>
                    </th>
                    <th scope="col" class="py-3">
                        <div class="d-flex justify-content-between align-items-center">
                            Cliente
                        </div>
                    </th>
                    <th scope="col">
                        <button type="button" class="btn btn-dark" v-on:click="recargar">
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody v-for="venta in ventas">
                <tr style="vertical-align: middle;" v-on:click="seleccionado(venta)">
                    <td>{{ venta.fecha }}</td>
                    <td>{{ venta.hora }}</td>
                    <td>{{ venta.barbero }}</td>
                    <td>{{ venta.cliente.nombres }} {{ venta.cliente.apellidos }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import firebase from 'firebase';
import { auto } from '@popperjs/core';

export default{

    beforeMount(){
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
                    this.mostrar = true
                    this.$swal.close()
            });
    },
    data(){
        return{
            ventas: [],
            mostrar: false,
        }
    },
    methods:{
        recargar(){
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
                .collection("ventas")
                    .where("fecha", "==", (new Date().toLocaleDateString("fr-CA")))
                    .get()
                    .then((result) => {
                        var list = []
                        for (var i in result.docs){
                            list.push(result.docs[i].data());
                        }
                        this.ventas = list
                        this.$swal.close()
                    })
        },
        seleccionado(item){
            // console.log(item)
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
                reverseButtons: true
            })
        },
    }
}
</script>

<style></style>