<template>
    <div class="contenedor_clientes border">
        <div class="d-flex justify-content-end m-3" v-if="isAdmin">
            <button type="button" class="btn btn-success me-2" v-if="store.state.CliComponents === 0"
             v-on:click="registrar">
                <i class="fa-solid fa-plus"></i>
                Registrar
            </button>
            <button v-if="store.state.CliComponents !== 0" class="btn btn-danger" v-on:click="cancelarBoton">
                Cancelar
            </button>
        </div>
        <div v-if="store.state.CliComponents === 0">
            <TablaClientes />
        </div>
        <div v-if="store.state.CliComponents === 1">
            <RegistroCliente />
        </div>
        <div v-if="store.state.CliComponents === 2">
            <EditCliente />
        </div>
        <div v-if="store.state.CliComponents === 3">
            <VisitasCliente />
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import EditCliente from './Clientes/EditCliente.vue';
import RegistroCliente from './Clientes/RegistroCliente.vue';
import TablaClientes from './Clientes/TablaClientes.vue';
import VisitasCliente from './Clientes/VisitasCliente.vue';

export default{
    beforeMount(){
        if(this.store.state.user.rol === "admin"){
            this.isAdmin = true
        }
    },
    data(){
        return{
            isAdmin: false,
        }
    },
    setup(){
        const store = useStore()

        return{
            store,
        }
    },
    methods: {
        registrar(){
            this.store.state.CliComponents = 1
        },
        cancelarBoton(){
            this.store.state.CliComponents = 0
        },
    },
    components: {
        RegistroCliente,
        TablaClientes,
        EditCliente,
        VisitasCliente
    }
}
</script>

<style>
.contenedor_clientes{
    background-color: white;
}
</style>