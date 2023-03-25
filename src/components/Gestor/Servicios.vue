<template>
    <div class="contenedor_servicios border">
        <div class="d-flex justify-content-end m-3">
            <button type="button" class="btn btn-success me-2"
             v-on:click="registrar">
                <i class="fa-solid fa-plus"></i>
                Registrar
            </button>
            <button class="btn btn-danger" v-on:click="cancelarBoton" v-if="store.state.SerComponents !== 0">
                Cancelar
            </button>
        </div>
        <div v-if="store.state.SerComponents === 0">
            <ServiciosTable />
        </div>
        <div v-if="store.state.SerComponents === 1">
            <RegistrarServicio />
        </div>
        <div v-if="store.state.SerComponents === 2">
            <EditServicio />
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import ServiciosTable from './Servicios/ServiciosTable.vue';
import RegistrarServicio from './Servicios/RegistrarServicio.vue';
import EditServicio from './Servicios/EditServicio.vue';

export default{
    setup(){
        const store = useStore();

        return{
            store
        }
    },
    components:{
        ServiciosTable,
        RegistrarServicio,
        EditServicio
    },
    methods:{
        registrar(){
            this.store.state.SerComponents = 1
        },
        cancelarBoton(){
            this.store.state.SerComponents = 0
        }
    }
}
</script>

<style>
.contenedor_servicios{
    background-color: white;
}
button{
    background-color: white;
}
</style>