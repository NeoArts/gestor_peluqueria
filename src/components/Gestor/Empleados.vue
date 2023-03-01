<template>
    <body>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Nombres</th>
                    <th scope="col">Apellidos</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody v-for="usuario in ListaUsuarios">
                <tr>
                <th scope="row">1</th>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
                </tr>
            </tbody>
        </table>
    </body>
</template>

<script>
import firebase from 'firebase';
import { ref } from 'vue';

export default{
    beforeMount(){
        this.usuarios()
        this.ListaUsuarios
    },
    data(){
        return{
            usuarios: null,
        }
    },
    setup(){
        var ListaUsuarios = [];

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
            ListaUsuarios = lista
            // console.log(ListaUsuarios)
        }

        return{
            usuarios,
            ListaUsuarios,
        }
    }
}
</script>

<style>

</style>