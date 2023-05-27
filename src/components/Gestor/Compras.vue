<template>
    <div class="Contenedor-Compras-Blanco">
        <div class="table-responsive" :style="{maxHeight: '250px', maxWidth: computedMaxWidth}">
            <table class="table table-bordered table-hover">
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
                                Codigo
                                <span v-on:click="aplicarSort(1)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Producto
                                <span v-on:click="aplicarSort(2)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                            </div>
                        </th>
                        <th scope="col">
                            <div class="d-flex justify-content-between align-items-center">
                                Cantidad del producto luego de la compra
                                <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-1-9 icono"></i></span>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody v-for="compra in compras">
                    <tr style="vertical-align: middle;" v-on:click="seleccionado(compra)">
                        <td>{{ compra.fecha }}</td>
                        <td>{{ compra.codigo }}</td>
                        <td>{{ compra.producto }}</td>
                        <td>{{ compra.cantidadPosterior }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="resumenCompra.mostrarResumen">
            <div class="d-flex m-1">
                <h2 class="mx-auto">Resumen de la Compra</h2>
                <span v-on:click="cerrarResumen" class="my-auto me-2"><i class="fa-solid fa-circle-xmark fa-lg"></i></span>
            </div>
            <!-- <div
             class="imagePreviewWrapper border"
             style="margin-right: auto; margin-left: auto;"
             :style="{ 'background-image': `url(${imgCompra})` }"></div> -->
            <img v-if="resumenCompra.imgCompra"
             class="imagePreviewWrapper border" 
             style="margin-right: auto; 
             margin-left: auto;" 
             :src=resumenCompra.imgCompra>

            <div class="d-flex m-1 justify-content-around flex-wrap">
                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Producto</h6>
                    <input type="text"
                     class="form-control-plaintext border-0 formato-inputs"
                     readonly
                     v-model="resumenCompra.compra.producto" />
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Código</h6>
                    <input type="text"
                     class="form-control-plaintext border-0 formato-inputs"
                     readonly
                     v-model="resumenCompra.compra.codigo" />
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Precio Unitario</h6>
                    <input type="text"
                     class="form-control-plaintext border-0 formato-inputs"
                     readonly
                     v-model="resumenCompra.compra.precio" />
                </div>

                <div class="p-1 border mx-auto caja text-center my-1">
                    <h6 class="border-bottom">Fecha</h6>
                    <input type="date"
                     class="form-control-plaintext border-0 formato-inputs"
                     readonly
                     v-model="resumenCompra.compra.fecha" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import { auto } from '@popperjs/core';
import { useStore } from 'vuex';

export default{
    data(){
        return{
            compras: [],
            computedMaxWidth: null,
            resumenCompra: {
                mostrarResumen: false,
                compra: null,
                imgCompra: null,
            },
        }
    },
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
        firebase
            .firestore()
            .collection("RegistroCompras")
            .get()
            .then((result) => {
                var list = [];
                for(var i in result.docs){
                    list.push(result.docs[i].data());
                }
                this.compras = list
                this.$swal.close()
            })
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
        calculateMaxWidth(){
            const containerWidth = window.outerWidth - 40;

            this.computedMaxWidth = `${containerWidth}px`;
        },
        aplicarSort(index){
            if(index === 0){
                this.compras.sort(function(a, b){
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
                this.compras.sort(function(a, b){
                    if(a.codigo > b.codigo){
                        return -1;
                    }
                    if(a.codigo < b.codigo){
                        return 1;
                    }
                    return 0;
                })
            }
            if(index === 2){
                this.compras.sort(function(a, b){
                    if(a.producto > b.producto){
                        return -1;
                    }
                    if(a.producto < b.producto){
                        return 1;
                    }
                    return 0;
                })
            }
            if(index === 3){
                this.compras.sort(function(a, b){
                    if(a.cantidadPosterior > b.cantidadPosterior){
                        return 1;
                    }
                    if(a.cantidadPosterior < b.cantidadPosterior){
                        return -1;
                    }
                    return 0;
                });
            }
        },
        seleccionado(compra){
            // console.log(compra);
            this.resumenCompra.compra = compra;
            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                width: auto,
                didOpen: () => {
                    this.$swal.showLoading();
                }
            })
            firebase
                .storage()
                .ref("RegistroCompras")
                .child(compra.factura)
                .getDownloadURL()
                .then(url => {
                    // console.log(url)
                    this.resumenCompra.imgCompra = url;
                    this.$swal.close()
                    this.resumenCompra.mostrarResumen = true;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        cerrarResumen(){
            this.resumenCompra.mostrarResumen = false;
            this.resumenCompra.compra = null;
            this.resumenCompra.imgCompra = null;
        },
    },
}
</script>

<style>
.Contenedor-Compras-Blanco{
    background-color: white;
}
.imagePreviewWrapper {
    border-radius: 5%;
    background-size: 150px;
    background-position: 50%;
    width: 200px;
    height: 200px;
    display: block;
    margin-left: 10%;
    margin-top: 5px;
    cursor: pointer;
    font-size: 16px;
    background-repeat: no-repeat;
}
</style>