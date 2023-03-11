<template>
    <div class="contenedor_inventario border">
        <div class="d-flex justify-content-end m-3" v-if="isAdmin">
            <button type="button" class="btn btn-success me-2"
             v-on:click="registrar">
                <i class="fa-solid fa-plus"></i>
                Registrar
            </button>
            <button class="btn btn-danger" v-on:click="cancelarBoton">
                Cancelar
            </button>
        </div>
        <div v-if="store.state.InvComponents === 0">
            <Productos />
        </div>
        <div v-if="store.state.InvComponents === 1">
            <RegistrarProducto />
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import RegistrarProducto from './Inventario/RegistrarProducto.vue';
import Productos from './Inventario/Productos.vue';

export default{
    beforeMount(){
        if(this.store.state.user.rol === "admin"){
            this.isAdmin = true;
        }
    },
    data(){
        return{
            items: null,
            isAdmin: false,
            component: 0,
        }
    },
    methods:{
        registrar(){
            this.store.state.InvComponents = 1
        },
        cancelarBoton(){
            this.store.state.InvComponents = 0
        },
    },
    setup(){
        const store = useStore()

        return{
            store,
        }
    },
    components:{
        RegistrarProducto,
        Productos
    }
}
</script>

<style>
.contenedor_inventario{
    background-color: white;
}
</style>