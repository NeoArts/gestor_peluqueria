<template>
    <div class="contenedor_principal_caja">
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
                <div class="d-flex flex-wrap">
                    <div class="p-1 border mx-auto caja text-center my-1">
                        <h6 class="border-bottom">Servicio/Producto</h6>
                        <input type="text"
                         id="SerPro"
                         class="form-control border-0 formato-inputs"
                         maxlength="30"
                         v-on:keyup="filtroSerPro"
                         v-model="filtro.item"/>
                         <div class="border contenedor_opciones hide" id="list_items">
                            <p class="my-1 opciones rounded mx-2"
                             v-for="item in items"
                             v-on:click="selectSerPro(item)">{{ item.producto }}</p>
                         </div>
                    </div>

                    <div class="p-1 border mx-auto caja text-center my-1">
                        <h6 class="border-bottom">Puntos</h6>
                        <input type="text"
                         class="form-control border-0 formato-inputs"
                         disabled
                         v-model="registroVenta.puntos"/>
                    </div>

                    <div class="p-1 border mx-auto caja text-center my-1">
                        <h6 class="border-bottom"
                         v-bind:class="[(filtro.identificador === 'pr') ? '' : 'text-muted']">Cantidad</h6>
                        <input type="text" 
                         class="form-control border-0 formato-inputs"
                         maxlength="2"
                         :disabled="!(filtro.identificador === 'pr')"
                         v-on:keyup="format(0)"
                         v-model="registroVenta.cantidad"/>
                    </div>
                </div>
                <div class="d-flex flex-wrap">
                    <div class="p-1 border mx-auto caja text-center my-1">
                        <h6 class="border-bottom">Metodo de Pago</h6>
                        <select class="form-control border-0 formato-inputs"
                         v-model="registroVenta.metodoPago">
                            <option value="puntos">Puntos</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="nequi">Nequi</option>
                            <option value="daviplata">Daviplata</option>
                            <option value="bancolombia">Qr Bancolombia</option>
                        </select>
                    </div>
                    <div class="p-1 border mx-auto caja text-center my-1">
                        <h6 class="border-bottom">Total</h6>
                        <input type="text"
                         class="form-control border-0 formato-inputs"
                         disabled
                         v-model="registroVenta.total"/>
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
export default{
    data(){
        return{
            pantallaGrande: ((window.innerWidth<1000) ? false : true),
            empleados: null,
            empleadosList: null,
            items: null,
            itemsList: null,
            clientes: null,
            clientesList: null,
            precioSelect: null,
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
                total: "",
            }
        }
    },
    beforeMount(){
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
                console.log(this.clientes)
            })
    },
    mounted(){
        this.$nextTick(() => {
            window.addEventListener('resize',this.onResize);
        })
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
            // console.log(SerPro)
            this.filtro.item = SerPro.producto
            this.filtro.identificador = SerPro.identificador
            this.registroVenta.item = SerPro.codigo
            this.registroVenta.puntos = SerPro.puntos
            this.precioSelect = SerPro.PrecioV
            if(SerPro.identificador === "sv"){
                this.registroVenta.cantidad = ""
                this.registroVenta.total = this.precioSelect
            }
            if(SerPro.identificador === "pr"){
                this.registroVenta.total = ""
            }
            const lista = document.getElementById("list_items")
            lista.classList.add("hide")
        },
        format(index){
            if(index === 0){
                var regex = new RegExp("^[0-9\s]*$");
                if(!regex.test(this.registroVenta.cantidad)){
                    this.$swal({
                        icon: 'error',
                        title: 'En este campo solo se permiten números'
                    })
                    this.registroVenta.cantidad = this.registroVenta.cantidad.replace(/[^\d\.]*/g,'');
                }
                else{
                    console.log(this.registroVenta.cantidad.split(".")[1])
                    this.registroVenta.total = ""+parseInt(this.registroVenta.cantidad) * parseFloat(this.precioSelect)
                    if(this.precioSelect.split(".")[1] === "000"){
                        this.registroVenta.total = this.registroVenta.total+".000"
                    }
                    
                }
            }
        },
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
</style>