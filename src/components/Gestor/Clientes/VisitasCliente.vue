<template>
    <div class="table-responsive" :style="{maxHeight: '250px', maxWidth: computedMaxWidth}">
        <table class="table table-bordered table-hover" >
            <thead>
                <tr class="table-dark">
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Fecha 
                            <span v-on:click="aplicarSort(0)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Hora
                            <span v-on:click="aplicarSort(1)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
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
                            Total
                            <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody v-for="visita in visitas">
                <tr style="vertical-align: middle;" v-on:click="seleccionado(visita)">
                    <th scope="row">{{ visita.fecha }}</th>
                    <td>{{ visita.hora }}</td>
                    <td>{{ visita.barbero }}</td>
                    <td v-if="visita.metodoPago === 'ef'">{{ visita.total }} Efectivo</td>
                    <td v-if="visita.metodoPago === 'nq'">{{ visita.total }} Nequi</td>
                    <td v-if="visita.metodoPago === 'qr'">{{ visita.total }} QR bancolombia</td>
                    <td v-if="visita.metodoPago === 'pt'">{{ visita.total }} Puntos</td>
                    <td v-if="visita.metodoPago === 'dv'">{{ visita.total }} Davivienda</td>
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
        // console.log(this.store.state.cliEdit)
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
                .collection("ventas")
                .get()
                .then((result) => {
                    var lista = []
                    for(var i in result.docs){
                        if(result.docs[i].data().cliente.documento === this.store.state.cliEdit){
                            lista.push(result.docs[i].data())
                        }
                        // lista.push(result.docs[i].data())
                    }
                    this.visitas = lista
                    this.$swal.close()
                    // console.log(this.visitas)
                })
        }catch(error){
            console.log(error)
        }
    },
    data(){
        return{
            visitas: [],
            computedMaxWidth: null,
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
    methods:{
        calculateMaxWidth() {
            const containerWidth = window.outerWidth - 40;

            this.computedMaxWidth = `${containerWidth}px`;
        },
        aplicarSort(index){
            if(index === 0){
                this.visitas.sort(function(a, b){
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
                this.visitas.sort(function(a, b){
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
                this.visitas.sort(function(a, b){
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
                this.visitas.sort(function(a, b){
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
        seleccionado(item){
            var lista = ""
            for(var i in item.items){
                lista += " - "+item.items[i].producto
            }
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
                                <p class="border-bottom fst-italic m-0 fw-bolder">Puntos Recibidos</p>
                                <p class="my-1">` + item.puntos + `</p>
                            </div>
                            <div class="m-0">
                                <p class="border-bottom fst-italic m-0 fw-bolder">Total</p>
                                <p class="my-1">` + item.total + `</p>
                            </div>
                        </div>
                        <div class="d-flex flex-wrap justify-content-around mb-2 p-0">
                            <div class="m-0">
                                <p class="border-bottom fst-italic m-0 fw-bolder">Lista</p>
                                <p class="my-1">` + lista + `</p>
                            </div>
                        </div>
                    </div>
                </div>
                `
            })
        }
    },
    setup(){
        const store = useStore()

        return {
            store
        }
    },
}
</script>

<style></style>