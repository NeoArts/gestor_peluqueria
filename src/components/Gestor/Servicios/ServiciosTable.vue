<template>
    <div v-if="pantallaGrande">
        <div class="d-flex mb-4">
            <input type="text" 
             class="form-control ms-5 me-2" 
             :style="{width: '350px'}"
             v-model="filtro"
             v-on:keyup="SoloLetras"
             maxlength="50"/>
            <p class="my-auto fw-bold">Ingresa el nombre del Producto</p>
        </div>
        <div class="table-responsive" v-if="mostrar" :style="{maxHeight: '250px'}">
            <table class="table table-bordered">
                <thead>
                    <tr class="table-dark">
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Código
                                <span v-on:click="aplicarSort(0)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Servicio
                                <span v-on:click="aplicarSort(1)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Puntos
                                <span v-on:click="aplicarSort(2)"><i class="fa-solid fa-arrow-down-1-9 icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Precio de Venta
                                <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-1-9 icono"></i></span>
                            </div>
                        </th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody v-for="ser in servicios">
                    <tr style="vertical-align: middle;">
                        <th scope="row">{{ ser.codigo }}</th>
                        <td>{{ ser.producto }}</td>
                        <td>{{ ser.puntos }}</td>
                        <td>{{ ser.PrecioV }}</td>
                        <td><button class="p-0 border-0" v-on:click="edit(ser)"><i class="fa-solid fa-pen-to-square"></i></button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
    <div v-else>
        <div class="d-flex mb-4 align-items-center">
            <input type="text" 
             class="form-control ms-1 me-2" 
             :style="{height: '30px'}"
             v-model="filtro"
             v-on:keyup="SoloLetras"
             maxlength="50"/>
            <p class="my-auto fw-bold">Servicio</p>
        </div>
        <div class="card mx-3 my-2" v-for="ser in servicios">
            <div class="card-header">
                <h4 class="card-title">{{ ser.producto }}</h4>
            </div>
            <div class="card-body">
                <h6 class="card-title">Código: {{ ser.codigo }}</h6>
                <p class="card-text mb-0"> Precio: {{ ser.PrecioV }}</p>
                <p class="card-text mt-0"> Puntos: {{ ser.puntos }}</p>
                <button class="btn btn-primary" v-on:click="edit(ser)">Editar &nbsp; <i class="fa-solid fa-pen-to-square"></i></button>
            </div>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
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
        try{
            firebase
                .firestore()
                .collection("items")
                .where("identificador", "==", "sv")
                .get()
                .then((result) => {
                    var lista = []
                    for(var i in result.docs){
                        lista.push(result.docs[i].data())
                    }
                    this.servicios = lista
                    this.serviciosAux = lista
                    this.$swal.close();
                    this.mostrar = true
                })
                
        }catch(error){
            this.$swal({
                icon: 'error',
                text: error.message
            })
        }
    },
    data(){
        return{
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            servicios: null,
            serviciosAux: null,
            mostrar: false,
            filtro: "",
        }
    },
    setup(){
        const store = useStore();

        return{
            store
        }
    },
    methods:{
        edit(servicio){
            this.store.state.serEdit = servicio;
            this.store.state.SerComponents = 2;
        },
        SoloLetras(){
            // console.log(this.filtro)
            var regex = new RegExp("^[A-Za-zñÑáéíóúÁÉÍÓÚ \s]*$");
            if(regex.test(this.filtro)){
                // console.log(this.filtro)
                var lista = []
                for(var i in this.serviciosAux){
                    if(this.serviciosAux[i].producto.includes(this.filtro)){
                        lista.push(this.serviciosAux[i])
                    }
                }
                this.servicios = lista
            }
            else{
                this.filtro = this.filtro.replace(/[^\d\.]*/g,'');
            }
        },
        aplicarSort(index){
            if(index === 0){
                this.servicios.sort(function(a, b){
                    return parseInt(a.codigo) - parseInt(b.codigo);
                })
            }
            if(index === 1){
                this.servicios.sort(function(a, b){
                    if(a.producto > b.producto){
                        return 1;
                    }
                    if(a.producto < b.producto){
                        return -1;
                    }
                    return 0;
                })
            }
            if(index === 2){
                this.servicios.sort(function(a, b){
                    return parseInt(a.puntos) - parseInt(b.puntos);
                })
            }
            if(index === 3){
                this.servicios.sort(function(a, b){
                    return parseInt(a.PrecioV.replaceAll(".","")) - parseInt(b.PrecioV.replaceAll(".",""));
                })
            }
        },
    },
}
</script>

<style>
span{
    cursor: pointer;
}
</style>