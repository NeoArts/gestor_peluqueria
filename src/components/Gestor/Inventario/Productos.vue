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
                                Producto
                                <span v-on:click="aplicarSort(1)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Cantidad
                                <span v-on:click="aplicarSort(2)"><i class="fa-solid fa-arrow-down-1-9 icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Precio
                                <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col" v-if="store.state.user.rol !== 'caja'"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody v-for="item in items">
                    <tr style="vertical-align: middle;">
                        <th scope="row">{{ item.codigo }}</th>
                        <td>{{ item.producto }}</td>
                        <td>{{ item.Cantidad }}</td>
                        <td>{{ item.PrecioV }}</td>
                        <td v-if="store.state.user.rol !== 'caja'"><button class="p-0 border-0" v-on:click="edit(item)"><i class="fa-solid fa-pen-to-square"></i></button></td>
                        <td class="d-flex border-0 flex-wrap justify-content-around">
                            <button class="p-0 border-0" v-on:click="masProducto(item)"><i class="fa-solid fa-plus"></i></button>
                            <button class="p-0 border-0" v-on:click="menosProducto(item)"><i class="fa-solid fa-minus"></i></button>
                        </td>
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
            <p class="my-auto fw-bold">Producto</p>
        </div>
        <div class="card mx-3 my-2" v-for="item in items">
            <div class="card-header">
                <h4 class="card-title">{{ item.producto }}</h4>
            </div>
            <div class="card-body">
                <h6 class="card-title">{{ item.codigo }}</h6>
                <p class="card-text mb-0"> Precio: {{ item.PrecioV }}</p>
                <p class="card-text mt-0"> Cantidad: {{ item.Cantidad }}</p>
                <div class="d-flex border-0 my-2 flex-wrap justify-content-around" style="width: 100px;">
                    <button class="p-0 border-0" v-on:click="masProducto(item)"><i class="fa-solid fa-plus"></i></button>
                    <button class="p-0 border-0" v-on:click="menosProducto(item)"><i class="fa-solid fa-minus"></i></button>
                </div>
                <button class="btn btn-primary" v-on:click="edit(item)">Editar &nbsp; <i class="fa-solid fa-pen-to-square"></i></button>
            </div>
        </div>
    </div>
    
</template>

<script>
import { auto } from '@popperjs/core';
import { useStore } from 'vuex';
import firebase from 'firebase';

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
                .where("identificador", "==", "pr")
                .get()
                .then((result) => {
                    var lista = []
                    for(var i in result.docs){
                        lista.push(result.docs[i].data())
                    }
                    this.items = lista
                    this.itemsAux = lista
                    this.totalRec = lista.length
                    this.mostrar = true
                    this.$swal.close()
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
            items: null,
            itemsAux: null,
            mostrar: false,
            totalRec: null,
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            filtro: "",
        }
    },
    methods: {
        SoloLetras(){
            var regex = new RegExp("^[A-Za-zñÑáéíóúÁÉÍÓÚ \s]*$");
            if(regex.test(this.filtro)){
                var lista = []
                for(var i in this.itemsAux){
                    if(this.itemsAux[i].producto.includes(this.filtro)){
                        lista.push(this.itemsAux[i])
                    }
                }
                this.items = lista
            }
            else{
                this.filtro = this.filtro.replace(/[^\d\.]*/g,'');
            }
        },
        masProducto(item){
            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                width: auto,
                didOpen: () => {
                    this.$swal.showLoading();
                }
            })
            item.Cantidad = (parseInt(item.Cantidad) + 1)+"";
            firebase
                .firestore()
                .collection("items")
                .doc(item.codigo)
                .set(item)
                .then((result) => {
                    // console.log(result)
                    this.$swal.close()
                })
        },
        menosProducto(item){
            if(parseInt(item.Cantidad) > 0){
                this.$swal({
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    width: auto,
                    didOpen: () => {
                        this.$swal.showLoading();
                    }
                })
                item.Cantidad = (parseInt(item.Cantidad) - 1)+"";
                firebase
                    .firestore()
                    .collection("items")
                    .doc(item.codigo)
                    .set(item)
                    .then((result) => {
                        console.log(result)
                        this.$swal.close()
                    })
            }
            
        },
        edit(producto){
            this.store.state.proEdit = producto;
            this.store.state.InvComponents = 3;
        },
        aplicarSort(index){
            if(index === 0){
                this.items.sort(function(a, b){
                    if(a.codigo > b.codigo){
                        return 1;
                    }
                    if(a.codigo < b.codigo){
                        return -1;
                    }
                    return 0;
                })
            }
            if(index === 1){
                this.items.sort(function(a, b){
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
                this.items.sort(function(a, b){
                    if(a.Cantidad >  b.Cantidad){
                        return 1;
                    }
                    if (a.Cantidad < b.Cantidad) {
                        return -1;
                    }
                    return 0;
                });
            }
            if(index === 3){
                // console.log(parseFloat(this.items[2].PrecioV))
                this.items.sort(function(a, b){
                    return parseInt(a.PrecioV.replaceAll(".","")) - parseInt(b.PrecioV.replaceAll(".",""))
                });
            }
        }
    },
    setup(){
        const store = useStore()

        return{
            store
        }
    },
    computed:{
        registros(){
            // console.log(this.store.state.perPage)
            return this.store.state.perPage
        }
    }
}
</script>

<style>
button{
    background-color: white;
}
</style>