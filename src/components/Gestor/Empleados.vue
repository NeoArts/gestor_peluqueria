<template>
    <div class="container_empleados">
        <div class="table-responsive" v-if="pantallaGrande">

            <div class="d-flex justify-content-end m-3" v-if="isAdmin">
                <button type="button" class="btn btn-success"
                 v-on:click="registrar">
                    <i class="fa-solid fa-plus"></i>
                    Registrar
                </button>
            </div>

            <table class="table table-bordered" v-if="mostrar">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nombres</th>
                        <th scope="col">Apellidos</th>
                        <th scope="col">Correo</th>
                        <th scope="col" v-if="isAdmin"></th>
                    </tr>
                </thead>
                <tbody v-for="user in usuarios" >
                    <tr style="vertical-align: middle;">
                        <th scope="row">{{ user.NoIdentificacion }}</th>
                        <td>{{ user.nombres }}</td>
                        <td>{{ user.apellidos }}</td>
                        <td>{{ user.correo }}</td>
                        <td v-if="isAdmin">
                            <button class="p-0 border-0" v-on:click="editar(''+user.uid)">
                                <i class="fa-solid fa-user-pen icono" ></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="table-responsive" v-else>
            <table class="table table-bordered" v-if="mostrar">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Nombre</th>
                        <th scope="col" v-if="isAdmin"></th>
                    </tr>
                </thead>
                <tbody v-for="user in usuarios" >
                    <tr style="vertical-align: middle;">
                        <th scope="row">{{ user.NoIdentificacion }}</th>
                        <td>{{ user.nombres }} {{ user.apellidos }}</td>
                        <td v-if="isAdmin">
                            <button class="p-0 border-0" v-on:click="editar(''+user.uid)">
                                <i class="fa-solid fa-user-pen icono"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</template>

<script>
import { auto } from '@popperjs/core';
import firebase from 'firebase';
import { useStore } from 'vuex';

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
            .collection("nomina")
            .get()
            .then((result) => {
                var lista = []
                for(var i in result.docs){
                    lista.push(result.docs[i].data().usuario)
                }
                this.usuarios = lista
                this.mostrar = true
                this.$swal.close();
            })
        if(this.store.state.user.rol === "admin"){
            this.isAdmin = true
        }
    },
    mounted(){
        this.$nextTick(() => {
        window.addEventListener('resize',this.onResize);
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize)
    },
    data(){
        return{
            usuarios: false,
            mostrar: false,
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            isAdmin: false,
        }
    },
    methods:{
        onResize(){
            this.pantallaGrande = ((window.innerWidth<1000) ? false : true);
        },
        registrar(){
            this.$router.push("/register")
        },
        editar(uid){
            this.$router.push("/editEmployee/"+uid)
        },
    },
    setup(){
        const store = useStore()
        var ListaUsuarios = null;

        async function usuarios(){
            var lista = []
            await firebase
                .firestore()
                .collection("nomina")
                .get()
                .then((result) => {
                    // console.log(result.docs)
                    for(var i in result.docs){
                        // console.log(result.docs[i].data().usuario)
                        lista.push(result.docs[i].data().usuario)
                    }
                })
            return lista
            // console.log(ListaUsuarios)
        }

        return{
            usuarios,
            ListaUsuarios,
            store
        }
    },
}
</script>

<style>
.container_empleados{
    background-color: aliceblue;
}
.icono{
    cursor: pointer;
}
</style>