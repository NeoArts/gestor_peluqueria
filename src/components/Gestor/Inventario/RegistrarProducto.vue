<template>
    <div class="container my-2">
        <div class="d-flex flex-wrap">
            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Código</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="10"
                 v-model="item.codigo" />
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Producto</h6>
                <input type="text"
                 class="form-control border-0 formato-inputs"
                 maxlength="30"
                 v-model="item.producto" />
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom">Puntos</h6>
                <input type="text"
                 v-on:keyup="formatP"
                 class="form-control border-0 formato-inputs"
                 maxlength="3"
                 v-model="item.puntos" />
            </div>
        </div>
        <div class="d-flex flex-wrap">
            

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom"
                 v-bind:class="[!(item.identificador === 'pr') ? 'text-muted' : '']">Tamaño</h6>
                 <div class="input-group">
                    <input type="text"
                     v-on:keyup="formatT"
                     class="form-control border formato-inputs"
                     maxlength="3"
                     :disabled="!(item.identificador === 'pr') || (item.tipotamano === 'UD')"
                     v-model="item.tamano" />
                    <select class="input-group-text"
                     :disabled="!(item.identificador === 'pr')"
                     v-bind:class="[!(item.identificador === 'pr') ? 'text-muted' : '']"
                     v-model="item.tipotamano"
                     v-on:change="cambioTipoTamano">
                        <option value="UD">UD</option>
                        <option value="g">G</option>
                        <option value="ml">ML</option>
                    </select>

                 </div>
                
            </div>

            <div class="p-1 border mx-auto caja text-center my-1">
                <h6 class="border-bottom"
                 v-bind:class="[!(item.identificador === 'pr') ? 'text-muted' : '']">Precio de Compra</h6>
                 <div class="input-group">
                    <span class="input-group-text border">$</span>
                    <input type="text"
                     v-on:keyup="format"
                     class="form-control border formato-inputs"
                     maxlength="10"
                     :disabled="!(item.identificador === 'pr')"
                     v-model="item.PrecioC" />
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
                     v-model="item.PrecioV" />
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
import firebase from 'firebase';
import { auto } from '@popperjs/core';

export default{
    setup(){
        const store = useStore()

        return{
            store,
        }
    },
    data(){
        return{
            item:{
                codigo: "",
                producto: "",
                identificador: "pr",
                puntos: "",
                tamano: "",
                tipotamano: null,
                PrecioC: "",
                PrecioV: "",
                Cantidad: 0,
            }
        }
    },
    methods: {
        format(){
            var num = this.item.PrecioC.replace(/\./g,'');
            if(!isNaN(num)){
                num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                num = num.split('').reverse().join('').replace(/^[\.]/,'');
                this.item.PrecioC = num;
            }
            else{
                this.$swal({
                    icon: 'error',
                    title: 'En este campo solo se permiten números'
                })
                this.item.PrecioC = this.item.PrecioC.replace(/[^\d\.]*/g,'');
            }
        },
        formatV(){
            var num = this.item.PrecioV.replace(/\./g,'');
            if(!isNaN(num)){
                num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                num = num.split('').reverse().join('').replace(/^[\.]/,'');
                this.item.PrecioV = num;
            }
            else{
                this.$swal({
                    icon: 'error',
                    title: 'En este campo solo se permiten números'
                })
                this.item.PrecioV = this.item.PrecioV.replace(/[^\d\.]*/g,'');
            }
        },
        formatP(){
            var num = this.item.puntos.replace(/\./g,'');
            if(isNaN(num)){
                this.$swal({
                    icon: 'error',
                    title: 'En este campo solo se permiten números'
                })
                this.item.puntos = this.item.puntos.replace(/[^\d\.]*/g,'');
            }
        },
        formatT(){
            var num = this.item.tamano.replace(/\./g,'');
            if(isNaN(num)){
                this.$swal({
                    icon: 'error',
                    title: 'En este campo solo se permiten números'
                })
                this.item.tamano = this.item.puntos.replace(/[^\d\.]*/g,'');
            }
        },
        cambioIdent(){
            if(this.item.identificador === "pr"){
                this.item.puntos = "";
            }
            if(this.item.identificador === "sv"){
                this.item.tamano = ""
                this.item.tipotamano = null
                this.item.PrecioC = ""
            }
        },
        cambioTipoTamano(){
            if(this.item.tipotamano === "UD"){
                this.item.tamano = ""
            }
        },
        cancelarBoton(){
            this.$router.push("/gestor/inventario")
        },
        submitForm: async function(){
            var errors = "";

            if(this.item.codigo === "" || this.item.producto === "" || this.item.identificador === null ||
            this.item.PrecioV === ""){
                errors = "Revisa el formulario, no debe haber campos vacios";
            }
            else if (this.item.identificador === "sv" && this.item.puntos === ""){
                errors = "Revisa el formulario, no debe haber campos vacios";
            }
            else if(this.item.identificador === "pr" && (this.item.tipotamano === null || this.item.PrecioC === "" || this.item.puntos === "")){
                errors = "Revisa el formulario, no debe haber campos vacios";
                
            }
            else if(this.item.identificador === "pr" && this.item.tipotamano !== "UD" && this.item.tamano === ""){
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
                if(this.item.identificador === "sv"){
                    this.$swal({
                        icon: 'question',
                        title: 'Registrar Item?',
                        text: 'Es la información que ingresaste correcta?',
                        html: `
                        <div class="d-flex border flex-column bd-highlight mb-3">
                            <div class="p-2 bd-highlight border">
                                <div class="d-flex justify-content-center p-0">
                                    <h5 class="mb-3">`+this.item.producto+`</h5>
                                </div>

                                <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Código</p>
                                        <p class="my-1">`+this.item.codigo+`</p>
                                    </div>
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Identificador</p>
                                        <p class="my-1">Servicio</p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Puntos</p>
                                        <p class="my-1">`+this.item.puntos+`</p>
                                    </div>
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Precio de Venta</p>
                                        <p class="my-1">`+this.item.PrecioV+`</p>
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
                                    .doc(this.item.codigo)
                                    .set(this.item)
                                    .then((result) => {
                                        this.$swal.close();
                                        this.store.state.InvComponents = 0;
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
                if(this.item.identificador === "pr"){
                    this.$swal({
                        icon: 'question',
                        title: 'Registrar Item?',
                        text: 'Es la información que ingresaste correcta?',
                        html: `
                        <div class="d-flex border flex-column bd-highlight mb-3">
                            <div class="p-2 bd-highlight border">
                                <div class="d-flex justify-content-center p-0">
                                    <h5 class="mb-3">`+this.item.producto+`</h5>
                                </div>

                                <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Código</p>
                                        <p class="my-1">`+this.item.codigo+`</p>
                                    </div>
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Identificador</p>
                                        <p class="my-1">Producto</p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Tamaño</p>
                                        <p class="my-1">`+this.item.tamano+` `+this.item.tipotamano+`</p>
                                    </div>
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Precio de Compra</p>
                                        <p class="my-1">`+this.item.PrecioC+`</p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-around flex-wrap mb-2 p-0">
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0">Precio de Venta</p>
                                        <p class="my-1">`+this.item.PrecioV+`</p>
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
                                    .doc(this.item.codigo)
                                    .set(this.item)
                                    .then((result) => {
                                        this.$swal.close();
                                        this.store.state.InvComponents = 0;
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
                
            }
        },
    },
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