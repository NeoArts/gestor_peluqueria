<template>
    <div class="table-responsive" v-if="mostrar" :style="{maxHeight: '250px'}">
        <table class="table table-bordered">
            <thead>
                <tr class="table-dark">
                    <th scope="col">Código</th>
                    <th scope="col">Producto</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Precio</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody v-for="item in items">
                <tr style="vertical-align: middle;">
                    <th scope="row">{{ item.codigo }}</th>
                    <td>{{ item.producto }}</td>
                    <td v-if="item.identificador === 'pr'">{{ item.Cantidad }}</td>
                    <td v-if="item.identificador === 'sv'"></td>
                    <td>{{ item.PrecioV }}</td>
                    <td v-if="item.identificador === 'pr'" class="d-flex border-0 flex-wrap justify-content-around">
                        <button class="p-0 border-0" v-on:click="masProducto(item)"><i class="fa-solid fa-plus"></i></button>
                        <button class="p-0 border-0" v-on:click="menosProducto(item)"><i class="fa-solid fa-minus"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <Pagination :total-rec="uwu"/>
</template>

<script>
import { auto } from '@popperjs/core';
import { useStore } from 'vuex';
import firebase from 'firebase';
import Pagination from '@/components/Pagination/Pagination.vue';

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
                .get()
                .then((result) => {
                    var lista = []
                    for(var i in result.docs){
                        lista.push(result.docs[i].data())
                        // console.log(result.docs[i].data())
                    }
                    this.items = lista
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
            mostrar: false,
        }
    },
    components: {
        Pagination
    },
    methods: {
        masProducto(item){
            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                width: auto,
                didOpen: () => {
                    this.$swal.showLoading();
                }
            })
            item.Cantidad = item.Cantidad + 1
            firebase
                .firestore()
                .collection("items")
                .doc(item.codigo)
                .set(item)
                .then((result) => {
                    console.log(result)
                    this.$swal.close()
                })
        },
        menosProducto(item){
            if(item.Cantidad > 0){
                this.$swal({
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    width: auto,
                    didOpen: () => {
                        this.$swal.showLoading();
                    }
                })
                item.Cantidad = item.Cantidad - 1
                firebase
                    .firestore()
                    .collection("item")
                    .doc(item.codigo)
                    .set(item)
                    .then((result) => {
                        console.log(result)
                        this.$swal.close()
                    })
            }
            
        },
    }
}
</script>

<style>
button{
    background-color: white;
}
</style>