<template>
    <div class="d-flex mb-4">
        <input type="text" 
         class="form-control ms-5 me-2" 
         :style="{width: '350px'}"
         v-model="filtro"
         v-on:keyup="SoloLetras"
         maxlength="50"/>
        <p class="my-auto fw-bold">Ingresa el nombre del Cliente</p>
    </div>
    <div class="table-responsive" v-if="mostrar" :style="{maxHeight: '250px'}">
        <table class="table table-bordered">
            <thead>
                <tr class="table-dark">
                    <th scope="col">Documento</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Edad</th>
                    <th scope="col">Correo</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody v-for="cliente in clientes">
                <tr style="vertical-align: middle;">
                    <th scope="row">{{ cliente.documento }}</th>
                    <td>{{ cliente.nombres }} {{ cliente.apellidos }}</td>
                    <td>{{ cliente.edad }}</td>
                    <td>{{ cliente.correo }}</td>
                    <td>
                        <button class="p-0 border-0" v-on:click="editar(cliente)">
                            <i class="fa-solid fa-user-pen icono" ></i>
                        </button>
                    </td>
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
                .collection("clientes")
                .get()
                .then((result) => {
                    var lista = []
                    for(var i in result.docs){
                        lista.push(result.docs[i].data().usuario)
                    }
                    this.clientes = lista
                    this.clientesAux = lista
                    this.mostrar = true
                    this.$swal.close()
                })
        }catch(error){
            console.log(error)
        }
    },
    data(){
        return{
            clientes: null,
            clientesAux: null,
            mostrar: false,
            filtro: "",
        }
    },
    methods: {
        editar(usuario){
            this.store.state.CliComponents = 2
            this.store.state.cliEdit = usuario
            // console.log(usuario)
        },
        SoloLetras(){
            var regex = new RegExp("^[A-Za-zñÑáéíóúÁÉÍÓÚ \s]*$");
            if(regex.test(this.filtro)){
                var list = []
                for(var i in this.clientesAux){
                    var nombres = this.clientesAux[i].nombres+" "+this.clientesAux[i].apellidos
                    if(nombres.includes(this.filtro)){
                        list.push(this.clientesAux[i])
                    }
                }
                this.clientes = list
            }
            
        }
    },
    setup(){
        const store = useStore()

        return {
            store
        }
    }
}
</script>

<style>
button{
    background-color: white;
}
</style>