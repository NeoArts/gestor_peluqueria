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
    <div class="table-responsive" v-if="mostrar" :style="{height: '250px'}">
        <table class="table table-bordered" >
            <thead>
                <tr class="table-dark">
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Documento 
                            <span v-on:click="aplicarSort(0)"><i class="fa-solid fa-arrow-down-a-z icono" :style="[filtros ? 'color: white;' : '']"></i></span>
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Nombre
                            <span v-on:click="aplicarSort(1)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Edad
                            <span v-on:click="aplicarSort(2)"><i class="fa-solid fa-arrow-down-1-9 icono"></i></span>
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Correo
                            <span v-on:click="aplicarSort(3)"><i class="fa-solid fa-arrow-down-a-z icono"></i></span>
                        </div>
                    </th>
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
            filtros: false,
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
            
        },
        aplicarSort(index){
            if(index === 0){
                this.clientes.sort(function(a, b){
                    if(a.documento >  b.documento){
                        return 1;
                    }
                    if (a.documento < b.documento) {
                        return -1;
                    }
                    return 0;
                });
                this.filtros= true
                console.log(this.filtros)
            }
            if(index === 1){
                this.clientes.sort(function(a, b){
                    if(a.nombres >  b.nombres){
                        return 1;
                    }
                    if (a.nombres < b.nombres) {
                        return -1;
                    }
                    return 0;
                });
            }
            if(index === 2){
                this.clientes.sort(function(a, b){
                    if(a.edad >  b.edad){
                        return 1;
                    }
                    if (a.edad < b.edad) {
                        return -1;
                    }
                    return 0;
                });
            }
            if(index === 3){
                this.clientes.sort(function(a, b){
                    if(a.correo >  b.correo){
                        return 1;
                    }
                    if (a.correo < b.correo) {
                        return -1;
                    }
                    return 0;
                });
            }
        },
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
.icono .active{
    color: white;
}
.icono {
    color: gray;
}
</style>