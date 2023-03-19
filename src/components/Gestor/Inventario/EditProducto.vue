<template>
    <div class="container my-2">
        <div class="d-flex flex-wrap">
            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Código</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="10"
                 v-model="producto.codigo" />
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Producto</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="30"
                 v-model="producto.producto" />
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Puntos</h6>
                <input type="text"
                 v-on:keyup="formatP"
                 class="form-control border-0 formato-inputs"
                 maxlength="3"
                 v-model="producto.puntos" />
            </div>
        </div>
        <div class="d-flex flex-wrap">
            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom"
                 v-bind:class="[!(producto.identificador === 'pr') ? 'text-muted' : '']">Tamaño</h6>
                 <div class="input-group">
                    <input type="text"
                     v-on:keyup="formatT"
                     class="form-control border formato-inputs"
                     maxlength="3"
                     :disabled="!(producto.identificador === 'pr') || (producto.tipotamano === 'UD')"
                     v-model="producto.tamano" />
                    <select class="input-group-text"
                     :disabled="!(producto.identificador === 'pr')"
                     v-bind:class="[!(producto.identificador === 'pr') ? 'text-muted' : '']"
                     v-model="producto.tipotamano"
                     v-on:change="cambioTipoTamano">
                        <option value="UD">UD</option>
                        <option value="g">G</option>
                        <option value="ml">ML</option>
                    </select>
                 </div>
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom"
                 v-bind:class="[!(producto.identificador === 'pr') ? 'text-muted' : '']">Precio de Compra</h6>
                 <div class="input-group">
                    <span class="input-group-text border">$</span>
                    <input type="text"
                     v-on:keyup="format"
                     class="form-control border formato-inputs"
                     maxlength="10"
                     :disabled="!(producto.identificador === 'pr')"
                     v-model="producto.PrecioC" />
                </div>
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Precio de Venta</h6>
                 <div class="input-group">
                    <span class="input-group-text border">$</span>
                    <input type="text"
                     v-on:keyup="formatV"
                     class="form-control border formato-inputs"
                     maxlength="10"
                     v-model="producto.PrecioV" />
                </div>
            </div>
        </div>
        <div class="d-flex flex-wrap justify-content-start my-3">
            <button class="btn btn-success px-3 py-1 border ms-5" v-on:click="submitForm">
                <h5>Guardar</h5>
            </button>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';
import { auto } from '@popperjs/core';
import { useStore } from 'vuex';

export default{
    beforeMount(){
        this.producto = this.store.state.proEdit;
    },
    data(){
        return{
            producto: null,
        }
    },
    setup(){
        const store = useStore()

        return{
            store
        }
    },
    methods:{
        cambioTipoTamano(){
            if(this.producto.tipotamano === "UD"){
                this.producto.tamano = ""
            }
        },
        formatP(){
            var num = this.producto.puntos.replace(/\./g,'');
            if(isNaN(num)){
                this.$swal({
                    icon: 'error',
                    title: 'En este campo solo se permiten números'
                })
                this.producto.puntos = this.producto.puntos.replace(/[^\d\.]*/g,'');
            }
        },
        submitForm: async function(){
            var errors = ""

            if(this.producto.codigo === "" || this.producto.producto === "" || this.producto.identificador !== "pr" ||
            this.producto.PrecioV === "" || this.producto.puntos === "" || this.producto.PrecioC === ""){
                errors = "Revisa el formulario, no debe haber campos vacios";
            }

            if(this.producto.tipotamano !== "UD" && this.producto.tamano === ""){
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
                                <h5 class="mb-3">`+this.producto.producto+`</h5>
                            </div>

                            <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Código</p>
                                    <p class="my-1">`+this.producto.codigo+`</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Puntos</p>
                                    <p class="my-1">`+this.producto.puntos+`</p>
                                </div>
                            </div>
                            <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Tamaño</p>
                                    <p class="my-1">`+this.producto.tamano+` `+this.producto.tipotamano+`</p>
                                </div>
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Precio de Compra</p>
                                    <p class="my-1">`+this.producto.PrecioC+`</p>
                                </div>
                            </div>
                            <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                <div class="m-0">
                                    <p class="border-bottom fst-italic m-0">Precio de Venta</p>
                                    <p class="my-1">`+this.producto.PrecioV+`</p>
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
                                .doc(this.producto.codigo)
                                .set(this.producto)
                                .then((result) => {
                                    this.$swal.close()
                                    this.store.state.InvComponents = 0
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

<style>
  .caja{
    height: 20%;
    width: 250px;
    border-radius: 5px;
  }
  .formato-inputs{
    text-align:center;
  }
</style>