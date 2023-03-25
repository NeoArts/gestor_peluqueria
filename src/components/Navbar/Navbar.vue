<template>
    <div ref="target"></div>

    <div class="sticky-menu p-0" :class="{ sticking }" v-if="mostrar">
        <div class="contenedor_barra d-flex justify-content-around" :class="{ sticking }" >
            <div class="d-flex align-items-center">
                <img src="../../assets/logo.png" alt="" width="80" height="80" class="my-auto" v-on:click="navegar_Home">
                <h2 class="ms-2 my-auto" v-on:click="navegar_Home" v-if="mostrarNombre">Galfersh Barber</h2>
            </div>
            <div class="d-flex align-items-center">
                <h5 class="mx-3 my-auto">Servicios</h5>
                <h5 class="mx-3 my-auto">Equipo</h5>
                <h5 class="mx-3 my-auto">Sobre Nosotros</h5>
                <div class="LogContainer mx-3 my-auto" v-on:click="navegar_Login" v-if="!store.state.isAuthenticated">
                    <h5 class="my-2 mx-3">Iniciar Sesión</h5>
                </div>
                <div class="LogContainer mx-3 my-auto" v-on:click="cerrarSesion()" v-else>
                    <h5 class="my-2 mx-3">Cerrar Sesión</h5>
                </div>
            </div>
        </div>
    </div>

    <div class="barra_pp d-flex justify-content-between border-bottom" v-if="!mostrar"> 
        <img src="../../assets/logo.png" class="my-auto ms-5" alt="" width="50" height="50" v-on:click="navegar_Home">
        <button class="btn me-5 p-0" id="botonMenu">
            <i class="fa-solid fa-bars fa-2x my-auto" style="color: white; cursor: pointer;"></i>
        </button>
        
    </div>
        
    <transition name="fade">
        <div class="MenuOpc" id="MenuOpcPP">
            <h5 class="text-center my-2">Servicios</h5>
            <h5 class="text-center my-2">Equipo</h5>
            <h5 class="text-center my-2">Sobre Nosotros</h5>
            <div class="LogContainer text-center mt-2 me-0" v-on:click="navegar_Login" v-if="!store.state.isAuthenticated">
                <h5 class="">Iniciar Sesión</h5>
            </div>
            <div class="LogContainer text-center mt-2 me-0" v-on:click="cerrarSesion" v-else>
                <h5 class="">Cerrar Sesión</h5>
            </div>
        </div>
    </transition>


</template>

<script>
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';

export default{
    data(){
        return{
            windowWidth: window.innerWidth,
            mostrar: ((window.innerWidth<1000) ? false : true),
            mostrarNombre: ((window.innerWidth<1200) ? false : true),
            mostrarMenu: false,
            handleEvent: {
                click: () => console.log("Has hecho click!"),
                mouseleave: () => this.mostrarMenu = false,
                mousewheel: (event) => console.log("moviste la rueda del ratón")
            }
        }
    },
    mounted(){
        this.$nextTick(() => {
            window.addEventListener('resize',this.onResize);
        })
        document.addEventListener("mouseup", function(event){
            var obj = document.getElementById('MenuOpcPP');
            var boton = document.getElementById('botonMenu')
            if(!obj.contains(event.target) ){
                if(boton.contains(event.target)){
                    // console.log(obj.style.visibility)
                    if(obj.style.visibility === "hidden" || obj.style.visibility === ""){
                        obj.style.visibility = "visible";
                    }
                    else{
                        obj.style.visibility = "hidden";
                    }
                }
                else{
                    obj.style.visibility = "hidden";
                }
            }
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize',this.onResize)
    },
    methods: {
        onResize(){
            this.windowWidth = window.innerWidth
            if(this.windowWidth < 1000){
                this.mostrar = false
            } else {
                this.mostrar = true
            }
            if(this.windowWidth < 1200){
                this.mostrarNombre = false
            } else {
                this.mostrarNombre = true
            }
        },
        navegar_Home(){
            this.$router.push("/");
        },
        navegar_Login(){
            this.$router.push("/login")
            document.getElementById('MenuOpcPP').style.visibility = "hidden"
        },
        cerrarSesion(){
            this.store.commit("setAuthenticated", false)
            this.store.commit("setUser", null)
            this.store.commit("setPhotoName", null)
            this.$router.push("/")
            document.getElementById('MenuOpcPP').style.visibility = "hidden"
        },
    },
    setup(){
        const target = ref();
        const sticking = ref(false);
        const store = useStore()

        const observer = new IntersectionObserver(
            ([entry]) => {
                sticking.value = !entry.isIntersecting;
            },
            { threshold: 0.0 }
        );

        onMounted(() => {
            observer.observe(target.value)
        });

        return {
            target,
            sticking,
            store
        }
    }
}
</script>

<style scoped>
.sticky-menu{
    transition: 150ms;
    position: sticky;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    padding: 1rem;
    height: 120px;
}
.sticky-menu.sticking{
    transition: 150ms;
    background-color: #000000;
    box-shadow: 0px 15px 10px -15px #111;
    height: 95px;
}
.barra_pp{
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    z-index: 1;
    background: rgba(0, 0, 0, 0.6);
    padding: 1rem;
    height: 80px;
}
.MenuOpc{
    top: 80px;
    left: 19%;
    right: 19%;
    position: absolute;
    z-index: 1;
    background: rgba(0, 0, 0, 0.6);
    border-top: 0.45rem solid #9f7c40;
    visibility: hidden;
}
.contenedor_barra{
    transition: 150ms;
    height: 120px;
}
.contenedor_barra.sticking{
    height: 95px;
    transition: 150ms;
}
.LogContainer{
    border-radius: 5px;
    background-color: #d1a052;
    cursor: pointer;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
h2, h5{
    color: white;
    cursor: pointer;
}
img{
    cursor: pointer;
}
button{
    background-color: transparent;
    border: 0;
}
</style>