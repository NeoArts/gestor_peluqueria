<template>
    <div>
        <h5 class="text-center">Imagen de la factura</h5>
        <div v-if="!previewImage"
         class="imagePreviewWrapper"
         style="margin-right: auto; margin-left: auto;"
         :style="{ 'background-image': `url(${require('../../assets/DocDefecto.png')})` }"
         @click="selectImage"></div>

        <div v-if="previewImage"
         class="imagePreviewWrapper"
         style="margin-right: auto; margin-left: auto;"
         :style="{ 'background-image': `url(${previewImage})` }"
         @click="selectImage"></div>

        <input
         ref="fileInput"
         type="file"
         class="invisible"
         @input="pickFile"
         accept="image/*"/>
    </div>
    <div class="d-flex m-3 justify-content-around flex-wrap">
        <div class="p-1 border mx-auto caja text-center my-1"
         style="width: 250px; border-radius: 5px;">
            <h6 class="border-bottom">Productos</h6>
            <input type="text"
             id="Producto"
             class="form-control border-0 formato-inputs"
             maxlength="30"
             v-on:keyup="filtroProducto"
             v-model="item"/>
            <div class="contenedor_opciones hide" id="list_productos">
                <p class="my-1 opciones rounded mx-2"
                 v-for="it in items"
                 v-on:click="selectProducto(it)">
                    {{ it.producto }}
                </p>
            </div>
        </div>

        <div class="p-1 border mx-auto caja text-center my-1">
            <h6 class="border-bottom">Cantidad</h6>
            <input type="text"
             v-on:keyup="formatoNum(0)"
             class="form-control border-0 formato-inputs"
             maxlength="3"
             v-model="cantidad" />
        </div>

        <div class="p-1 border mx-auto caja text-center my-1">
            <h6 class="border-bottom">Precio de Compra</h6>
            <div class="input-group">
                <span class="input-group-text border">$</span>
                <input type="text"
                 v-on:keyup="formatoNum(1)"
                 class="form-control border formato-inputs"
                 maxlength="8"
                 v-model="precio" />
            </div>
        </div>
    </div>
    <div class="d-flex m-0 justify-content-around">
        <button class="btn btn-success my-4"
         v-on:click="submitForm"
         style="height: 50px;">
            <h6 class="my-auto">Registrar Compra</h6>
        </button>
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
            .collection("items")
                .where("identificador", "==", "pr")
            .get()
            .then((result) => {
                var list = []
                for(var i in result.docs){
                    list.push(result.docs[i].data())
                }
                this.items = list;
                this.itemsList = list;
                this.$swal.close();
            })
    },
    mounted(){
        const productos = document.getElementById("Producto");
        productos.addEventListener("focusin", () => {
            const lista = document.getElementById("list_productos");
            lista.classList.remove("hide");
        });
    },
    data(){
        return{
            items: [],
            itemsList: [],
            mostrar: false,
            item: "",
            producto: null,
            cantidad: "",
            precio: "",
            previewImage: null,
            image: null,
        }
    },
    methods: {
        filtroProducto(){
            var lista = [];
            for(var i in this.itemsList){
                if(this.itemsList[i].codigo.toLowerCase().includes(this.item) || this.itemsList[i].producto.toLowerCase().includes(this.item)){
                    lista.push(this.itemsList[i]);
                }
            }
            this.items = lista;
        },
        selectProducto(item){
            this.item = item.producto;
            this.producto = item;
            const lista = document.getElementById("list_productos")
            lista.classList.add("hide");
        },
        formatoNum(index) {
            if(index === 0){
                var num = this.cantidad.replace(/\./g, "");
                if (isNaN(num)) {
                    this.$swal({
                        icon: "error",
                        title: "En este campo solo se permiten números"
                    });
                    this.cantidad = this.cantidad.replace(/[^\d\.]*/g, "");
                }
            }
            if(index === 1){
                var num = this.precio.replace(/\./g, "");
                if(!isNaN(num)){
                    num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                    num = num.split('').reverse().join('').replace(/^[\.]/,'');
                    this.precio = num;
                }else{
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.precio = this.precio.replace(/[^\d\.]*/g,'');
                }
            }
            
        },
        selectImage(){
            this.$refs.fileInput.click()
        },
        pickFile (){
            let input = this.$refs.fileInput
            let file = input.files
            this.image = file[0]
            if(file && file[0]){
            let reader = new FileReader
            reader.onload = e => {
                this.previewImage = e.target.result
            }

            reader.readAsDataURL(file[0])
            this.$emit('input', file[0])
            }
        },
        submitForm(){
            var errors = "";
            if(this.previewImage === null){
                errors = "No se detectó la imagen de la factura";
            }
            if(this.producto === null || this.cantidad === "" || this.precio === ""){
                errors = "Se detectaron campos vacíos en el formulario";
            }

            if(errors !== ""){
                this.$swal({
                    icon: 'error',
                    title: 'Problemas en el formulario',
                    text: errors,
                })
            }else{
                this.$swal({
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    width: auto,
                    didOpen: () => {
                        this.$swal.showLoading();
                    }
                })

                var cantidad = this.producto.Cantidad;
                this.producto.Cantidad = (parseInt(this.producto.Cantidad)+parseInt(this.cantidad))+"";

                var PrecioC = parseInt(this.precio.replaceAll(".","")) / this.cantidad;
                PrecioC = (PrecioC).toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g,'$1.');
                PrecioC = PrecioC.split('').reverse().join('').replace(/^[\.]/,'');
                
                this.producto.PrecioC = PrecioC;
                var compra = {
                    codigo: this.producto.codigo,
                    producto: this.producto.producto,
                    precio: this.precio,
                    cantidadAnterior: cantidad,
                    cantidadPosterior: this.producto.Cantidad,
                    fecha: new Date().toLocaleDateString("fr-CA"),
                    factura: null,
                }

                try{
                    firebase
                        .firestore()
                        .collection("items")
                        .doc(this.producto.codigo)
                        .set(this.producto)
                        .then(() => {
                            firebase
                                .storage()
                                .ref("RegistroCompras")
                                .child("("+compra.fecha+")-("+compra.codigo+")")
                                .put(this.image)
                                .then((snapshot) => {
                                    compra.factura = "("+compra.fecha+")-("+compra.codigo+")";
                                    firebase
                                        .firestore()
                                        .collection("RegistroCompras")
                                        .doc(compra.factura)
                                        .set(compra)
                                        .then(() => {
                                            this.$swal.close();
                                            this.item= "";
                                            this.producto= null;
                                            this.cantidad= "";
                                            this.precio = "";
                                            this.previewImage= null;
                                            this.image= null;
                                        })
                                })
                        });
                }catch(error){
                    this.$swal({
                        icon: "error",
                        text: error.message
                    });
                }
                
            }
        }
    },
}
</script>

<style>
.formato-inputs{
    text-align:center;
}
.hide{
    display: none;
}
.opciones{
    cursor: pointer;
}
.opciones:hover{
    background-color: rgb(109, 109, 109);
}
.contenedor_opciones{
    max-height: 115px;
    overflow-y: scroll;
}
.imagePreviewWrapper {
    border-radius: 5%;
    background-size: 150px;
    background-position: 50%;
    width: 150px;
    height: 150px;
    display: block;
    cursor: pointer;
    font-size: 16px;
    background-repeat: no-repeat;
}
</style>