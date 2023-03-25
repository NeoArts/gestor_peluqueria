<template>
    <div class="container my-2">
        <div class="d-flex flex-wrap">
            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Código</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="10"
                 v-model="servicio.codigo" />
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Producto</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="30"
                 v-model="servicio.producto" />
            </div>
        </div>
        <div class="d-flex flex-wrap">
            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Puntos</h6>
                <input type="text"
                 v-on:keyup="format(0)"
                 class="form-control border-0 formato-inputs"
                 maxlength="3"
                 v-model="servicio.puntos" />
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Precio de Venta</h6>
                 <div class="input-group">
                    <span class="input-group-text border">$</span>
                    <input type="text"
                     v-on:keyup="format(1)"
                     class="form-control border formato-inputs"
                     maxlength="10"
                     v-model="servicio.PrecioV" />
                </div>
            </div>
        </div>
        <div class="d-flex flex-wrap justify-content-start">
            <button class="btn btn-success px-3 py-1 border ms-5" v-on:click="submitForm">
                <h5>Guardar</h5>
            </button>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { auto } from '@popperjs/core';
import firebase from 'firebase';

export default{
    beforeMount(){
        this.servicio = this.store.state.serEdit;
    },
    data(){
        return{
            servicio : null,
        }
    },
    setup(){
        const store = useStore();

        return{
            store
        }
    },
    methods: {
        format(index){
            if(index === 0){
                var num = this.servicio.puntos.replace(/\./g,'');
                if(isNaN(num)){
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.servicio.puntos = this.servicio.puntos.replace(/[^\d\.]*/g,'');
                }
            }
            if(index === 1){
                var num = this.servicio.PrecioV.replace(/\./g,'');
                if(!isNaN(num)){
                    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                    num = num.split('').reverse().join('').replace(/^[\.]/,'');
                    this.servicio.PrecioV = num;
                }
                else{
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.servicio.PrecioV = this.servicio.PrecioV.replace(/[^\d\.]*/g,'');
                }
            }
        },
        submitForm: async function(){
            var errors = "";

            if(this.servicio.codigo === "" || this.servicio.producto === "" || this.servicio.puntos === "" ||
             this.servicio.PrecioV === ""){
                errors = "Revisa el formulario, no debe haber campos vacios";
            }
            if(errors !== ""){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas en el formulario',
                    text: errors
                });
            }
            else{
                this.$swal({
                    icon: 'question',
                    title: 'Registrar Item?',
                    text: 'Es la información que ingresaste correcta?',
                    html: `
                    <div class="d-flex border flex-column bd-highlight mb-3">
                        <div class="p-2 bd-highlight border">
                            <div class="d-flex justify-content-center p-0">
                                <h5 class="mb-3">`+this.servicio.producto+`</h5>
                            </div>

                            <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Código</p>
                                    <p class="my-1">`+this.servicio.codigo+`</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Puntos</p>
                                    <p class="my-1">`+this.servicio.puntos+`</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Precio de Venta</p>
                                    <p class="my-1">`+this.servicio.PrecioV+`</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Registrar',
                    cancelButtonText: 'Cancelar',
                    reverseButtons: true
                }).then((result) => {
                    if(result.isConfirmed){
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
                                .doc(this.servicio.codigo)
                                .set(this.servicio)
                                .then((result) => {
                                    this.$swal.close();
                                    this.store.state.SerComponents = 0
                                })
                        }catch(error){
                            this.$swal({
                                icon: 'error',
                                text: error.message
                            })
                        }
                    }
                })
            }
        },
    }
}
</script>

<style></style>