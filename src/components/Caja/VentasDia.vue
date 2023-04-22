<template>
    <div class="table-responsive" v-if="mostrar" :style="{maxHeight: '250px'}">
        <table class="table table-bordered" >
            <thead>
                <tr class="table-dark">
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Fecha
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Hora
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Barbero
                        </div>
                    </th>
                    <th scope="col">
                        <div class="d-flex justify-content-between align-items-center">
                            Cliente
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody v-for="venta in ventas">
                <tr style="vertical-align: middle;">
                    <td>{{ venta.fecha }}</td>
                    <td>{{ venta.hora }}</td>
                    <td>{{ venta.barbero }}</td>
                    <td>{{ venta.cliente.nombres }} {{ venta.cliente.apellidos }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import firebase from 'firebase';
export default{

    beforeMount(){
        firebase
            .firestore()
            .collection("ventas")
                .where("fecha", "==", (new Date().toLocaleDateString("fr-CA")))
                // .orderBy("hora", "asc")
                .get()
                .then((result) => {
                    var list = [];
                    for (var i in result.docs) {
                        list.push(result.docs[i].data());
                    }
                    this.ventas = list;
                    this.mostrar = true
            });
    },
    data(){
        return{
            ventas: [],
            mostrar: false,
        }
    }
}
</script>

<style></style>