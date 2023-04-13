<template>
    <div class="contenedor_principal_caja" v-if="mostrar">
        <div class="card" v-if="pantallaGrande" style="margin-left: 140px; margin-right: 140px; margin-top: 160px;">
            <div class="card-header">
                <h1 class="text-center">Galfersh Barber</h1>
            </div>
            <div class="card-body">
                <div class="d-flex flex-wrap">
                    <div class="p-1 border mx-auto caja text-center my-1">
                        <h6 class="border-bottom">Fecha</h6>
                        <input 
                         id="startDate" 
                         class="form-control border-0 formato-inputs" 
                         type="date" 
                         maxlength="30"
                         :style="{'width': '15rem'}"
                         v-model="registroVenta.fecha"/>
                    </div>

                    <div class="p-1 border mx-auto caja text-center my-1" id="contenedor_barbero">
                        <h6 class="border-bottom">Barbero</h6>
                        <input type="text"
                         id="barbero"
                         class="form-control border-0 formato-inputs"
                         maxlength="30"
                         v-on:keyup="filtroEmpl"
                         v-model="filtro.barbero"/>
                        <div class="border contenedor_opciones hide" id="list_empleados">
                            <p class="my-1 opciones rounded mx-2" 
                             v-for="bar in empleados"
                             v-on:click="selectEmple(bar)">{{ bar.nombres }} {{ bar.apellidos }}</p>
                        </div>
                    </div>

                    <div class="p-1 border mx-auto caja text-center my-1" id="contenedor_cliente">
                        <h6 class="border-bottom">Cliente</h6>
                        <input type="text"
                         id="cliente"
                         class="form-control border-0 formato-inputs"
                         maxlength="30"
                         v-on:keyup="filtroClie"
                         v-model="filtro.cliente"/>
                        <div class="border contenedor_opciones hide" id="list_clientes">
                            <p class="my-1 opciones rounded mx-2" 
                             v-for="cli in clientes"
                             v-on:click="selectCli(cli)">{{ cli.nombres }} {{ cli.apellidos }}</p>
                        </div>
                    </div>
                </div>

                <div class="border rounded-3 container shadow my-4">
                    <div class="mt-2"
                     style="margin-left: 100px; margin-right: 100px;">
                        <h5 class="p-2 m-0">Carrito</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="border mx-3 p-1 text-center"
                             style="width: 250px; border-radius: 5px;">
                                <h6 class="border-bottom">Servicio o Producto</h6>
                                <input type="text"
                                 id="SerPro"
                                 class="form-control border-0 formato-inputs"
                                 maxlength="30"
                                 v-on:keyup="filtroSerPro"
                                 v-model="filtro.item"/>
                                <div class="contenedor_opciones hide" id="list_items">
                                    <p class="my-1 opciones rounded mx-2"
                                     v-for="item in items"
                                     v-on:click="selectSerPro(item)">
                                        {{ item.producto }}
                                    </p>
                                </div>
                            </div>  
                            <div>
                                <p class="text-muted m-0 text-end">Total</p>
                                <h5 class="text-end">${{ registroVenta.total }}</h5>
                            </div>                          
                        </div>
                    </div>
                    <div class="mb-2"
                     style="margin-left: 100px; margin-right: 100px;">
                        <div v-if="carrito.length !== 0">
                            <div class="d-flex border justify-content-around my-3 mx-0 shadow-sm border-3 rounded-3" 
                             style="width: 100%;"
                             v-for="item in carrito">
                                <div class="my-4 d-flex align-items-center">
                                    <i v-if="item.identificador === 'sv'" class="fa-solid ms-3 fa-scissors fa-2xl  p-2"></i>
                                    <i v-if="item.identificador === 'pr'" class="fa-solid ms-3 fa-jar fa-2xl p-2"></i>
                                    <div class="my-auto ms-5">
                                        <h5 class="fw-bold">{{ item.producto }}</h5>
                                        <div class="d-flex align-items-center">
                                            <p class="my-0 fs-5 fst-italic fw-bolder">Total: </p>&nbsp;&nbsp;&nbsp;
                                            <p class="my-0 fs-5 fw-light">{{ item.PrecioV }}</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="border my-auto ms-5" 
                                 style="margin-right: 0%;">
                                    <p class="my-0 fs-5 fst-italic fw-bolder">Puntos</p>
                                    <p class="my-0 fs-5 fw-light">{{ item.puntos }}</p>
                                </div>

                                <div class="my-auto d-flex">
                                    <button class="p-0 border-0" v-on:click="deleteSerPro(item.codigo)"><i class="fa-solid fa-circle-xmark fa-xl"></i></button>
                                </div>
                            </div>
                        </div>
                        <div v-else>No hay servicios o productos registrados</div>
                    </div>
                </div>
                
            </div>
        </div>

        <div v-else class="card mx-5" style="margin-top: 100px;">
            <div class="card-header">
                Featured
            </div>
            <div class="card-body">
                <h5 class="card-title">Special title treatment</h5>
                <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    </div>
    
</template>

<script>
import firebase from 'firebase'
import { useStore } from 'vuex'
export default{
    data(){
        return{
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            mostrar: false,
            empleados: null,
            empleadosList: null,
            items: null,
            itemsList: null,
            clientes: null,
            clientesList: null,
            precioSelect: null,
            carrito: [],
            filtro:{
                barbero: "",
                cliente: "",
                item: "",
                identificador: null,
            },
            registroVenta: {
                fecha:  new Date().toLocaleDateString(),
                barbero: null,
                cliente: null,
                item: null,
                puntos: null,
                cantidad: "",
                metodoPago: null,
                total: 0,
            }
        }
    },
    beforeMount(){
        console.log(this.store.state.user)
        if(this.store.state.user === null || this.store.state.user.rol === "barbero"){
            this.$swal({
                icon: 'error',
                title: 'Tenemos un problema',
                text: 'Ha ocurrido un problema, lo sentimos',
                confirmButtonText: 'Volver'
            }).then(() => {
                this.$router.push("/")
            })
        } 
        else{
            
            this.formatoFecha(this.registroVenta.fecha)
            firebase
                .firestore()
                .collection("nomina")
                .get()
                .then((result) => {
                    var list = []
                    for(var i in result.docs){
                        if(result.docs[i].data().usuario.rol !== "caja"){
                            list.push(result.docs[i].data().usuario)
                        }
                    }
                    this.empleados = list
                    this.empleadosList = list
                })
            firebase
                .firestore()
                .collection("items")
                .get()
                .then((result) => {
                    var list = []
                    for(var i in result.docs){
                        list.push(result.docs[i].data())
                    }
                    this.items = list
                    this.itemsList = list
                })
            firebase
                .firestore()
                .collection("clientes")
                .get()
                .then((result) => {
                    var list = []
                    for(var i in result.docs){
                        list.push(result.docs[i].data().usuario)
                    }
                    this.clientes = list
                    this.clientesList = list
                    // console.log(this.clientes)
                })
            this.mostrar = true
        }       
    },
    mounted(){
        this.$nextTick(() => {
            window.addEventListener('resize',this.onResize);
        })
        if(this.mostrar){
            const barbero = document.getElementById("barbero")
            barbero.addEventListener("focusin", () => {
                const lista = document.getElementById("list_empleados")
                lista.classList.remove("hide")
            });
            const cliente = document.getElementById("cliente")
            cliente.addEventListener("focusin", () => {
                const lista = document.getElementById("list_clientes")
                lista.classList.remove("hide")
            })
            const SerPro = document.getElementById("SerPro")
            SerPro.addEventListener("focusin", () => {
                const lista = document.getElementById("list_items")
                lista.classList.remove("hide")
            });
        }
        
        // const contenedor_barbero = document.getElementById("contenedor_barbero")
        // contenedor_barbero.addEventListener("focusout", () => {
        //     const lista = document.getElementById("list_empleados")
        //     lista.classList.add("hide")
        // })
    },
    beforeDestroy() {
        window.removeEventListener('resize',this.onResize)
    },
    methods:{
        onResize(){
            this.pantallaGrande = ((window.innerWidth<1000) ? false : true)
        },
        formatoFecha(fecha){
            fecha = fecha.split("/")
            if(fecha[1].length === 1){fecha[1] = "0"+fecha[1]}
            if(fecha[0].length === 1){fecha[0] = "0"+fecha[0]}
            this.registroVenta.fecha = fecha[2]+"-"+fecha[1]+"-"+fecha[0]
        },
        filtroEmpl(){
            var lista = []
            for(var i in this.empleadosList){
                var nombre = this.empleadosList[i].nombres + " " + this.empleadosList[i].apellidos
                if(this.empleadosList[i].NoIdentificacion.includes(this.filtro.barbero) || nombre.includes(this.filtro.barbero)){
                    lista.push(this.empleadosList[i])
                }
            }
            this.empleados = lista
        },
        filtroClie(){
            var lista = []
            for(var i in this.clientesList){
                var nombre = this.clientesList[i].nombres+" "+this.clientesList[i].apellidos
                if(this.clientesList[i].documento.replaceAll(".","").includes(this.filtro.cliente) || nombre.includes(this.filtro.cliente)){
                    lista.push(this.clientesList[i])
                }
            }
            this.clientes = lista
        },
        filtroSerPro(){
            var lista = []
            for(var i in this.itemsList){
                if(this.itemsList[i].codigo.includes(this.filtro.item) || this.itemsList[i].producto.includes(this.filtro.item)){
                    lista.push(this.itemsList[i])
                }
            }
            this.items = lista
            // console.log(this.filtro.item)
        },
        selectEmple(empleado){
            // console.log(empleado)
            this.filtro.barbero = empleado.nombres+" "+empleado.apellidos
            this.registroVenta.barbero = empleado.NoIdentificacion
            const lista = document.getElementById("list_empleados")
            lista.classList.add("hide")
        },
        selectCli(cliente){
            this.filtro.cliente = cliente.nombres+" "+cliente.apellidos
            this.registroVenta.cliente = cliente.documento
            const lista = document.getElementById("list_clientes")
            lista.classList.add("hide")
        },
        selectSerPro(SerPro){
            console.log(SerPro)
            this.filtro.item = SerPro.producto
            this.carrito.push(SerPro)
            this.registroVenta.total += parseInt(SerPro.PrecioV.replaceAll(".",""))
            const lista = document.getElementById("list_items")
            lista.classList.add("hide")
        },
        deleteSerPro(codigo){
            // console.log(codigo)
            // this.carrito = this.carrito.filter(element => element.codigo !== codigo)
            // console.log(this.carrito)
            var lista = []
            for(var i in this.carrito){
                if(this.carrito[i].codigo === codigo){
                    this.carrito.splice(i,1)
                    break;
                }
            }
            this.$forceUpdate();
            // this.registroVenta.total -= parseInt(SerPro.PrecioV.replaceAll(".",""))
        },
    },
    setup(){
        const store = useStore();

        return{
            store
        }
    }
}
</script>

<style>
.contenedor_principal_caja{
    background-image: url('../assets/BackgroundCaja.jpg');
    min-height: 100vh;
    min-width: 100%;
    position: absolute;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    top: 0;
}
.caja{
    height: 20%;
    width: 250px;
    border-radius: 5px;
}
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
button{
    background-color: white;
}
button :hover{
    background-color: rgb(169, 169, 169);
}
</style>