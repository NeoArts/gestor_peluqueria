<template>
    <div class="contenedor_principal_caja" v-if="mostrar">
        <div v-if="pantallaGrande">
            <div class="card" style="margin-left: 140px; margin-right: 140px; margin-top: 160px;">
                <div class="card-header">
                    <h1 class="text-center">Galfersh Barber</h1>
                    <button type="button" class="btn" v-on:click="recargar">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
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
                            autocomplete="off"
                            v-model="filtro.barbero"/>
                            <div class="border contenedor_opciones hide" id="list_empleados">
                                <p class="my-1 opciones rounded mx-2" 
                                v-for="bar in empleados"
                                v-on:click="selectEmple(bar)">{{ bar.nombres }} {{ bar.apellidos }}</p>
                            </div>
                            <!-- <select class="form-select border-0 formato-inputs"
                             v-model="registroVenta.barbero">
                                <option v-for="bar in empleados">{{ bar.nombres }} </option>
                            </select> -->
                        </div>

                        <div class="p-1 border mx-auto caja text-center my-1" id="contenedor_cliente">
                            <h6 class="border-bottom">Cliente</h6>
                            <input type="text"
                            id="cliente"
                            class="form-control border-0 formato-inputs"
                            maxlength="30"
                            v-on:keyup="filtroClie"
                            autocomplete="off"
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
                                    autocomplete="off"
                                    v-model="filtro.item"/>
                                    <div class="contenedor_opciones hide" id="list_items">
                                        <p class="my-1 opciones rounded mx-2"
                                        v-for="item in items"
                                        v-on:click="selectSerPro(item)">
                                            {{ item.producto }}
                                        </p>
                                    </div>
                                </div>  
                                <div class="d-flex">
                                    <div>
                                        <p class="text-muted m-0 text-end">Total</p>
                                        <h5 v-if="registroVenta.metodoPago !== 'pt'" class="text-end">${{ registroVenta.total }}</h5>
                                        <h5 v-else class="text-end">{{ registroVenta.total }}</h5>
                                    </div>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <div>
                                        <p class="text-muted m-0 text-end">Puntos</p>
                                        <h5 class="text-end">{{ registroVenta.puntos }}</h5>
                                    </div>
                                </div>                          
                            </div>
                        </div>
                        <div class="mb-2"
                        style="margin-left: 100px; margin-right: 100px; max-height: 300px; overflow: scroll;">
                            <div v-if="carrito.length !== 0">
                                <div style="width: 100%;"
                                v-for="item in carrito">
                                    <div v-if="item.identificador === 'sv'" class="d-flex border justify-content-around my-3 mx-0 shadow-sm border-3 rounded-3" >
                                        <div class="my-4 d-flex align-items-center">
                                            <i class="fa-solid ms-3 fa-scissors fa-2xl  p-2"></i>
                                            <!-- <i v-if="item.identificador === 'pr'" class="fa-solid ms-3 fa-jar fa-2xl p-2"></i> -->
                                            <div class="my-auto ms-5">
                                                <h5 class="fw-bold">{{ item.producto }}</h5>
                                                <div class="d-flex align-items-center">
                                                    <p class="my-0 fs-5 fst-italic fw-bolder">Total: </p>&nbsp;&nbsp;&nbsp;
                                                    <p class="my-0 fs-5 fw-light">{{ item.PrecioV }}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="my-auto ms-5" 
                                        style="margin-right: 0%;">
                                            <p class="my-0 fs-5 fst-italic fw-bolder">Puntos</p>
                                            <p class="my-0 fs-5 fw-light">{{ item.puntos }}</p>
                                        </div>

                                        <div class="my-auto d-flex">
                                            <button class="p-0 border-0" v-on:click="deleteSerPro(item.codigo)"><i class="fa-solid fa-circle-xmark fa-xl"></i></button>
                                        </div>
                                    </div>
                                    <div v-if="item.identificador === 'pr'" class="d-flex border justify-content-around my-3 mx-0 shadow-sm border-3 rounded-3">
                                        <div class="my-4 d-flex align-items-center">
                                            <!-- <i class="fa-solid ms-3 fa-scissors fa-2xl  p-2"></i> -->
                                            <i class="fa-solid ms-3 fa-jar fa-2xl p-2"></i>
                                            <div class="my-auto ms-5">
                                                <h5 class="fw-bold">{{ item.producto }}</h5>
                                                <div class="d-flex align-items-center">
                                                    <p class="my-0 fs-5 fst-italic fw-bolder">Total: </p>&nbsp;&nbsp;&nbsp;
                                                    <p class="my-0 fs-5 fw-light">{{ item.PrecioV }}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="my-auto ms-5 border rounded-3" 
                                        style="margin-right: 0%;">
                                            <p class="my-0 fs-5 fst-italic fw-bolder border-bottom">Cantidad</p>
                                            <div class="d-flex justify-content-around">
                                                <button class="p-0 border-0" v-on:click="restarProducto(item)"><i class="fa-solid fa-minus"></i></button>
                                                {{ item.cantidadVenta }}
                                                <button class="p-0 border-0" v-on:click="sumarProducto(item)"><i class="fa-solid fa-plus"></i></button>
                                            </div>
                                        </div>

                                        <div class="my-auto d-flex">
                                            <button class="p-0 border-0" v-on:click="deleteSerPro(item.codigo)"><i class="fa-solid fa-circle-xmark fa-xl"></i></button>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div v-else>No hay servicios o productos registrados</div>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap justify-content-around align-items-center">
                        <div class="p-1 border ms-5 caja">
                            <h6 class="border-bottom">Método de Pago</h6>
                            <select class="form-select border-0 formato-inputs"
                            v-model="registroVenta.metodoPago"
                            v-on:change="cambiarMetodoPago">
                                <option value="ef">Efectivo</option>
                                <option value="pt">Puntos</option>
                                <option value="nq">Nequi</option>
                                <option value="dv">Daviplata</option>
                                <option value="qr">Qr Bancolombia</option>
                            </select>
                        </div>

                        <div class="p-1 border mx-auto caja text-center my-1">
                            <h6 class="border-bottom">Efectivo</h6>
                            <div class="input-group">
                                <span class="input-group-text border">$</span>
                                <input type="text"
                                v-on:keyup="formatoNum"
                                class="form-control border formato-inputs"
                                maxlength="15"
                                :disabled="(registroVenta.metodoPago !== 'ef')"
                                v-on:keypress.enter="calcular"
                                v-model="filtro.efectivo" />
                            </div>
                        </div>

                        <button type="button" style="height: 50px; width: 150px;"
                        class="btn btn-success me-5"
                        v-on:click="calcular">
                            <h6 class="my-auto">Registrar Venta</h6>
                        </button>
                    </div>
                    
                </div>
            </div>
            <div class="card" style="margin-left: 140px; margin-right: 140px; margin-top: 100px;">
                <ul class="nav nav-pills nav-fill">
                    <li class="nav-item">
                        <a class="nav-link"
                         :class="[(store.state.CajaInv === 0) ? 'active' : '']"
                         v-on:click="cambiarComponente(0)">Ventas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                         :class="[(store.state.CajaInv === 1) ? 'active' : '']"
                         v-on:click="cambiarComponente(1)">Registrar Cliente</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                         :class="[(store.state.CajaInv === 2) ? 'active' : '']"
                         v-on:click="cambiarComponente(2)">Registrar Producto</a>
                    </li>
                </ul>
                <!-- <RegistroCliente /> -->

                <VentasDia v-if="store.state.CajaInv === 0"/>
                <RegistroCliente v-if="store.state.CajaInv === 1"/>
                <InventarioCaja v-if="store.state.CajaInv === 2"/>
            </div>
        </div>
        
        <div v-else>
            <div class="card mx-3" style="margin-top: 100px;">
                <div class="card-header">
                    <h1 class="text-center">Galfersh Barber</h1>
                    <button type="button" class="btn" v-on:click="recargar">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
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
                            autocomplete="off"
                            v-model="filtro.barbero"/>
                            <div class="border contenedor_opciones hide" id="list_empleados">
                                <p class="my-1 opciones rounded mx-2" 
                                v-for="bar in empleados"
                                v-on:click="selectEmple(bar)">{{ bar.nombres }} {{ bar.apellidos }}</p>
                            </div>
                            <!-- <select class="form-select border-0 formato-inputs"
                             v-model="registroVenta.barbero">
                                <option v-for="bar in empleados">{{ bar.nombres }} </option>
                            </select> -->
                        </div>

                        <div class="p-1 border mx-auto caja text-center my-1" id="contenedor_cliente">
                            <h6 class="border-bottom">Cliente</h6>
                            <input type="text"
                            id="cliente"
                            class="form-control border-0 formato-inputs"
                            maxlength="30"
                            v-on:keyup="filtroClie"
                            autocomplete="off"
                            v-model="filtro.cliente"/>
                            <div class="border contenedor_opciones hide" id="list_clientes">
                                <p class="my-1 opciones rounded mx-2" 
                                v-for="cli in clientes"
                                v-on:click="selectCli(cli)">{{ cli.nombres }} {{ cli.apellidos }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="border rounded-3 container shadow my-4">
                        <h5 class="text-center mt-2">Carrito</h5>
                        <div class="border mx-auto text-center my-1"
                        style="border-radius: 5px;">
                            <h6 class="border-bottom">Servicio o Producto</h6>
                            <input type="text"
                            id="SerPro"
                            class="form-control border-0 formato-inputs"
                            maxlength="30"
                            v-on:keyup="filtroSerPro"
                            autocomplete="off"
                            v-model="filtro.item"/>
                            <div class="contenedor_opciones hide" id="list_items">
                                <p class="my-1 opciones rounded mx-2"
                                v-for="item in items"
                                v-on:click="selectSerPro(item)">
                                    {{ item.producto }}
                                </p>
                            </div>
                        </div>

                        <div class="d-flex align-items-center mt-2">
                            <h6 class="m-0 text-end">Total:</h6>
                            &nbsp;
                            <p v-if="registroVenta.metodoPago !== 'pt'" class="text-end text-muted my-auto">${{ registroVenta.total }}</p>
                            <p v-else class="text-end text-muted">{{ registroVenta.total }}</p>
                        </div>
                        <div class="d-flex align-items-center mb-2">
                            <h6 class="m-0 text-end">Puntos:</h6>
                            &nbsp;
                            <p class="text-end text-muted my-auto">{{ registroVenta.puntos }}</p>
                        </div>

                        <div style="overflow: scroll;">
                            <div v-if="carrito.length !== 0">
                                <div v-for="item in carrito" class="card my-2">
                                    <div class="card-header">
                                        <h4 class="card-title">{{ item.producto }}</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-flex align-items-center">
                                            <p class="my-0 fst-italic fw-bolder">Total: </p>&nbsp;
                                            <p class="my-0 fw-light">{{ item.PrecioV }}</p>
                                        </div>

                                        <div v-if="item.identificador === 'sv'" class="d-flex align-items-center">
                                            <p class="my-0 fst-italic fw-bolder">Puntos: </p>&nbsp;
                                            <p class="my-0 fw-light">{{ item.puntos }}</p>
                                        </div>   
                                        
                                        <div v-if="item.identificador === 'pr'" class="mt-2 border rounded-3">
                                            <p class="my-0 fst-italic fw-bolder border-bottom">Cantidad</p>
                                            <div class="d-flex justify-content-around">
                                                <button class="p-0 border-0" v-on:click="restarProducto(item)"><i class="fa-solid fa-minus"></i></button>
                                                {{ item.cantidadVenta }}
                                                <button class="p-0 border-0" v-on:click="sumarProducto(item)"><i class="fa-solid fa-plus"></i></button>
                                            </div>
                                        </div>

                                        <button class="btn btn-primary mt-2" v-on:click="deleteSerPro(item.codigo)">Eliminar</button>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-muted">No hay servicios o productos registrados</div>
                        </div>
                    </div>

                    <div class="d-flex flex-wrap justify-content-around align-items-center">
                        <div class="p-1 border caja">
                            <h6 class="border-bottom">Método de Pago</h6>
                            <select class="form-select border-0 formato-inputs"
                            v-model="registroVenta.metodoPago"
                            v-on:change="cambiarMetodoPago">
                                <option value="ef">Efectivo</option>
                                <option value="pt">Puntos</option>
                                <option value="nq">Nequi</option>
                                <option value="dv">Daviplata</option>
                                <option value="qr">Qr Bancolombia</option>
                            </select>
                        </div>

                        <div class="p-1 border mx-auto caja text-center my-1">
                            <h6 class="border-bottom">Efectivo</h6>
                            <div class="input-group">
                                <span class="input-group-text border">$</span>
                                <input type="text"
                                v-on:keyup="formatoNum"
                                class="form-control border formato-inputs"
                                maxlength="15"
                                :disabled="(registroVenta.metodoPago !== 'ef')"
                                v-on:keypress.enter="calcular"
                                v-model="filtro.efectivo" />
                            </div>
                        </div>

                        <button type="button" style="height: 50px; width: 150px;"
                        class="btn btn-success"
                        v-on:click="calcular">
                            <h6 class="my-auto">Registrar Venta</h6>
                        </button>
                    </div>

                    
                </div>

            </div>
            <div class="card mt-5">
                <ul class="nav nav-pills nav-fill">
                    <li class="nav-item">
                        <a class="nav-link"
                         :class="[(store.state.CajaInv === 0) ? 'active' : '']"
                         v-on:click="cambiarComponente(0)">Ventas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                         :class="[(store.state.CajaInv === 1) ? 'active' : '']"
                         v-on:click="cambiarComponente(1)">Registrar Cliente</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link"
                         :class="[(store.state.CajaInv === 2) ? 'active' : '']"
                         v-on:click="cambiarComponente(2)">Registrar Producto</a>
                    </li>
                </ul>

                <!-- <RegistroCliente /> -->

                <VentasDia v-if="store.state.CajaInv === 0"/>
                <RegistroCliente v-if="store.state.CajaInv === 1"/>
                <InventarioCaja v-if="store.state.CajaInv === 2"/>
            </div>
        </div>
    </div>
    
</template>

<script>
import firebase from 'firebase'
import { useStore } from 'vuex'
import { auto } from '@popperjs/core';
import RegistroCliente from '@/components/Gestor/Clientes/RegistroCliente.vue';
import VentasDia from '@/components/Caja/VentasDia.vue';
import Productos from '@/components/Gestor/Inventario/Productos.vue';
import InventarioCaja from '@/components/Caja/InventarioCaja.vue';

export default{
    data() {
        return {
            pantallaGrande: ((window.innerWidth < 1000) ? false : true),
            mostrar: false,
            empleados: null,
            empleadosList: null,
            items: null,
            itemsList: null,
            clientes: null,
            clientesList: null,
            precioSelect: null,
            ventas: null,
            carrito: [],
            productosPuntos: null,
            filtro: {
                barbero: "",
                cliente: "",
                item: "",
                identificador: null,
                efectivo: "",
            },
            registroVenta: {
                fecha: new Date().toLocaleDateString(),
                hora: "",
                barbero: null,
                cliente: null,
                items: [],
                metodoPago: "ef",
                puntos: 0,
                total: 0,
            }
        };
    },
    beforeMount() {
        // console.log(this.store.state.user);
        if (this.store.state.user === null || this.store.state.user.rol === "barbero") {
            this.$swal({
                icon: "error",
                title: "Tenemos un problema",
                text: "Ha ocurrido un problema, lo sentimos",
                confirmButtonText: "Volver"
            }).then(() => {
                this.$router.push("/");
            });
        }
        else {
            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                width: auto,
                didOpen: () => {
                    this.$swal.showLoading();
                }
            });
            this.formatoFecha(this.registroVenta.fecha);
            firebase
                .firestore()
                .collection("items")
                .get()
                .then((result) => {
                    var list = [];
                    for (var i in result.docs) {
                        list.push(result.docs[i].data());
                    }
                    this.items = list;
                    this.itemsList = list;
                    firebase
                        .firestore()
                        .collection("clientes")
                        .get()
                        .then((result) => {
                            var list = [];
                            for (var i in result.docs) {
                                list.push(result.docs[i].data().usuario);
                            }
                            this.clientes = list;
                            this.clientesList = list;
                            firebase
                                .firestore()
                                .collection("Puntos")
                                .get()
                                .then((result) => {
                                    var list = [];
                                    for (var i in result.docs) {
                                        list.push(result.docs[i].data());
                                    }
                                    this.productosPuntos = list;
                                    firebase
                                        .firestore()
                                        .collection("nomina")
                                        .get()
                                        .then((result) => {
                                            var list = [];
                                            for (var i in result.docs) {
                                                if (result.docs[i].data().usuario.rol !== "caja") {
                                                    list.push(result.docs[i].data().usuario);
                                                }
                                            }
                                            this.empleados = list;
                                            this.empleadosList = list;
                                            console.log(this.empleados)
                                            this.$swal.close();
                                        
                                    });
                            });
                    });
            });
            
            
            
            this.mostrar = true;
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener("resize", this.onResize);
        });
        
        if (this.mostrar) {
            const barbero = document.getElementById("barbero");
            barbero.addEventListener("focusin", () => {
                const lista = document.getElementById("list_empleados");
                lista.classList.remove("hide");
            });
            const cliente = document.getElementById("cliente");
            cliente.addEventListener("focusin", () => {
                const lista = document.getElementById("list_clientes");
                lista.classList.remove("hide");
            });
            const SerPro = document.getElementById("SerPro");
            SerPro.addEventListener("focusin", () => {
                const lista = document.getElementById("list_items");
                lista.classList.remove("hide");
            });
        }
        // if(!this.pantallaGrande){
        //     const barbero = document.getElementById("barbero_pp");
        //     barbero.addEventListener("focusin", () => {
        //         const lista = document.getElementById("list_empleados_pp");
        //         lista.classList.remove("hide");
        //     });
        // }
        // const contenedor_barbero = document.getElementById("contenedor_barbero")
        // contenedor_barbero.addEventListener("focusout", () => {
        //     const lista = document.getElementById("list_empleados")
        //     lista.classList.add("hide")
        // })
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },
    methods: {
        onResize() {
            this.pantallaGrande = ((window.innerWidth < 1000) ? false : true);
        },
        formatoFecha(fecha) {
            fecha = fecha.split("/");
            if (fecha[1].length === 1) {
                fecha[1] = "0" + fecha[1];
            }
            if (fecha[0].length === 1) {
                fecha[0] = "0" + fecha[0];
            }
            this.registroVenta.fecha = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
        },
        formatoNum() {
            var num = this.filtro.efectivo.replace(/\./g, "");
            if (isNaN(num)) {
                this.$swal({
                    icon: "error",
                    title: "En este campo solo se permiten números"
                });
                this.filtro.efectivo = this.filtro.efectivo.replace(/[^\d\.]*/g, "");
            }
        },
        cambiarMetodoPago() {
            this.filtro.efectivo = "";
            if (this.registroVenta.metodoPago === "pt") {
                var list = [];
                var list1 = [];
                for (var i in this.productosPuntos) {
                    list.push(this.productosPuntos[i].codigo);
                }
                for (var i in this.itemsList) {
                    if (list.includes(this.itemsList[i].codigo)) {
                        list1.push(this.itemsList[i]);
                    }
                }
                this.items = list1;
                this.registroVenta.total = 0
                this.registroVenta.puntos = 0
                if (this.carrito.length !== 0) {
                    for (var i in this.carrito) {
                        if (!list.includes(this.carrito[i].codigo)) {
                            this.carrito.splice(i, 1);
                        }
                    }
                    for(var i in this.carrito){
                        for(var j in this.productosPuntos){
                            if(this.carrito[i].codigo === this.productosPuntos[j].codigo){
                                this.registroVenta.total += parseInt(this.productosPuntos[j].puntos)
                                break;
                            }
                        }
                    }
                }
            }
            else {
                this.items = this.itemsList;
                this.registroVenta.total = 0
                this.registroVenta.puntos = 0
                for(var i in this.carrito){
                    if(this.carrito[i].identificador === "pr"){
                        this.registroVenta.total += parseInt(this.carrito[i].PrecioV.replaceAll(".", "")) * parseInt(this.carrito[i].cantidadVenta);
                    }
                    else{
                        this.registroVenta.total += parseInt(this.carrito[i].PrecioV.replaceAll(".", ""));
                    }
                    if (!isNaN(parseInt(this.carrito[i].puntos))){
                        this.registroVenta.puntos += parseInt(this.carrito[i].puntos)
                    }
                }
            }
        },
        filtroEmpl() {
            var lista = [];
            for (var i in this.empleadosList) {
                var nombre = (this.empleadosList[i].nombres + " " + this.empleadosList[i].apellidos).toLowerCase();
                if (this.empleadosList[i].NoIdentificacion.includes(this.filtro.barbero) || nombre.includes(this.filtro.barbero)) {
                    lista.push(this.empleadosList[i]);
                }
            }
            this.empleados = lista;
        },
        filtroClie() {
            var lista = [];
            for (var i in this.clientesList) {
                var nombre = (this.clientesList[i].nombres + " " + this.clientesList[i].apellidos).toLowerCase();
                if (this.clientesList[i].documento.replaceAll(".", "").includes(this.filtro.cliente) || nombre.includes(this.filtro.cliente)) {
                    lista.push(this.clientesList[i]);
                }
            }
            this.clientes = lista;
        },
        filtroSerPro() {
            var lista = [];
            for (var i in this.itemsList) {
                if (this.itemsList[i].codigo.toLowerCase().includes(this.filtro.item) || this.itemsList[i].producto.toLowerCase().includes(this.filtro.item)) {
                    lista.push(this.itemsList[i]);
                }
            }
            this.items = lista;
            // console.log(this.filtro.item)
        },
        selectEmple(empleado) {
            // console.log(empleado)
            this.filtro.barbero = empleado.nombres + " " + empleado.apellidos;
            this.registroVenta.barbero = empleado.nombres + " " + empleado.apellidos;
            const lista = document.getElementById("list_empleados");
            lista.classList.add("hide");
        },
        selectCli(cliente) {
            this.filtro.cliente = cliente.nombres + " " + cliente.apellidos;
            this.registroVenta.cliente = cliente;
            const lista = document.getElementById("list_clientes");
            lista.classList.add("hide");
        },
        selectSerPro(SerPro) {
            this.filtro.item = SerPro.producto;
            var producto = SerPro;
            console.log(SerPro)

            if(SerPro.identificador === "pr" && parseInt(SerPro.Cantidad) > 0){
                for(var i in this.carrito){
                    if(this.carrito[i].codigo === SerPro.codigo){
                        this.$swal({
                            icon: "error",
                            title: SerPro.producto+" ya se encuentra en el carrito"
                        });
                        return;
                    }
                }
                producto.cantidadVenta = 1;
                this.carrito.push(producto);
            }
            else if(SerPro.identificador === "pr" && parseInt(SerPro.Cantidad) === 0){
                this.$swal({
                    icon: "error",
                    title: SerPro.producto+" no se ecuentra disponible"
                });
                return;
            }
            else{
                this.carrito.push(SerPro);
            }
            if(this.registroVenta.metodoPago === "pt"){
                for(var i in this.productosPuntos){
                    if(this.productosPuntos[i].codigo === SerPro.codigo){
                        this.registroVenta.total += parseInt(this.productosPuntos[i].puntos)
                        break
                    }
                }
                
            }
            else{
                this.registroVenta.total += parseInt(SerPro.PrecioV.replaceAll(".", ""));
                if (!isNaN(parseInt(SerPro.puntos))) {
                    this.registroVenta.puntos += parseInt(SerPro.puntos);
                }
            }
            const lista = document.getElementById("list_items");
            lista.classList.add("hide");
        },
        sumarProducto(item){
            // console.log(item)
            for(var i in this.itemsList){
                if(this.itemsList[i].codigo === item.codigo){
                    if((item.cantidadVenta+1) <= this.itemsList[i].Cantidad){
                        if(this.registroVenta.metodoPago === "pt"){
                            this.registroVenta.total += parseInt(this.itemsList[i].puntos)
                        } else {
                            this.registroVenta.total += parseInt(this.itemsList[i].PrecioV.replaceAll(".", ""))
                            if(this.itemsList[i].puntos !== ""){
                                this.registroVenta.puntos = parseInt(this.registroVenta.puntos) + parseInt(this.itemsList[i].puntos);
                            }
                        }
                        item.cantidadVenta += 1;
                    }
                    return;
                }
            }
        },
        restarProducto(item){
            for(var i in this.itemsList){
                if(this.itemsList[i].codigo === item.codigo){
                    if((item.cantidadVenta-1) > 0){
                        if(this.registroVenta.metodoPago === "pt"){
                            this.registroVenta.total -= parseInt(this.itemsList[i].puntos)
                        } else {
                            this.registroVenta.total -= parseInt(this.itemsList[i].PrecioV.replaceAll(".", ""))
                            if(this.itemsList[i].puntos !== ""){
                                this.registroVenta.puntos = parseInt(this.registroVenta.puntos) - parseInt(this.itemsList[i].puntos);
                            }
                        }
                        item.cantidadVenta -= 1;
                    }
                }
            }
        },
        deleteSerPro(codigo) {
            if(this.registroVenta.metodoPago === "pt"){
                for(var i in this.productosPuntos){
                    if(this.productosPuntos[i].codigo === codigo){
                        this.registroVenta.total -= parseInt(this.productosPuntos[i].puntos);
                        break;
                    }
                }
                for(var i in this.carrito){
                    if(this.carrito[i].codigo === codigo){
                        this.carrito.splice(i, 1);
                    }
                }
            }
            else{
                for(var i in this.carrito){
                    if(this.carrito[i].codigo === codigo){
                        if(this.carrito[i].identificador === "pr"){
                            this.registroVenta.total -= parseInt(this.carrito[i].PrecioV.replaceAll(".", "")) * this.carrito[i].cantidadVenta;
                            if(!isNaN(parseInt(this.carrito[i].puntos))){
                                this.registroVenta.puntos -= parseInt(this.carrito[i].puntos) * this.carrito[i].cantidadVenta;
                            }
                        }
                        else{
                            this.registroVenta.total -= parseInt(this.carrito[i].PrecioV.replaceAll(".", ""));
                            if(!isNaN(parseInt(this.carrito[i].puntos))){
                                this.registroVenta.puntos -= parseInt(this.carrito[i].puntos);
                            }
                        }
                        this.carrito.splice(i, 1);
                    }
                }
            }
        },
        cambiarComponente(index){
            this.store.state.CajaInv = index
        },
        recargar(){
            this.$swal({
                allowEscapeKey: false,
                allowOutsideClick: false,
                width: auto,
                didOpen: () => {
                    this.$swal.showLoading();
                }
            });
            firebase
                .firestore()
                .collection("clientes")
                .get()
                .then((result) => {
                    var list = [];
                    for(var i in result.docs){
                        list.push(result.docs[i].data().usuario);
                    }
                    this.clientes = list;
                    this.clientesList = list;
                    firebase
                        .firestore()
                        .collection("items")
                        .get()
                        .then((result) => {
                            list = [];
                            for(var i in result.docs){
                                list.push(result.docs[i].data());
                            }
                            this.items = list;
                            this.itemsList = list;
                            this.carrito = [];
                            this.registroVenta.total = 0;
                            this.registroVenta.puntos = 0;
                            this.registroVenta.cliente = null;
                            this.filtro.item = "";
                            this.filtro.cliente = "";
                            this.$swal.close();
                        })
                })
        },
        calcular() {
            var errors = "";
            
            var productos = [];
            for(var i in this.carrito){
                if(this.carrito[i].identificador === "pr"){
                    productos.push(this.carrito[i])
                }
            }

            var DiezPorsiento = false;
            var clienteDiezPorsiento = null;
            if(this.registroVenta.cliente !== null){
                if(this.registroVenta.cliente.CodAfiliado !== ""){
                    DiezPorsiento = true;
                    for(var i in this.clientesList){
                        if(this.clientesList[i].documento === this.registroVenta.cliente.CodAfiliado){
                            clienteDiezPorsiento = this.clientesList[i];
                        }
                    }
                }
            }
            // clienteDiezPorsiento.puntos = this.registroVenta.cliente.puntos;
            // console.log(clienteDiezPorsiento);

            // for(var i in NoDisponibles){
            //     errors += NoDisponibles[i].producto+"\n";
            // }
            // if(errors!==""){
            //     errors += "Los productos anteriormente mencionados no estan disponibles";
            // }

            if (this.registroVenta.barbero === null || this.registroVenta.cliente === null || this.carrito.length === 0
                || (this.registroVenta.metodoPago === "ef" && this.filtro.efectivo === "")) {
                errors = "No puede haber campos vacíos en el formulario";
            }

            if (errors !== "") {
                this.$swal({
                    icon: "error",
                    title: errors
                });
                console.log(this.carrito)
            }
            else {
                var lista = [];
                for (var i in this.carrito) {
                    var item = { codigo: this.carrito[i].codigo, producto: this.carrito[i].producto, PrecioV: this.carrito[i].PrecioV, identificador: this.carrito[i].identificador };
                    lista.push(item);
                }
                this.registroVenta.items = lista;

                if (this.registroVenta.metodoPago === "pt") {
                    if(this.registroVenta.cliente.puntos < this.registroVenta.total){
                        this.$swal({
                            icon: 'error',
                            title: 'No es posible efectuar la transacción',
                            text: 'El usuario no tiene suficientes puntos'
                        })
                    }
                    else{
                        this.$swal({
                            icon: "question",
                            title: "Registrar Venta?",
                            html: `
                            <div class="d-flex border flex-column bd-highlight mb-3">
                                <div class="p-2 bd-highlight border">
                                    <div class="d-flex justify-content-around mb-2 p-0">
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Barbero</p>
                                            <p class="my-1">` + this.registroVenta.barbero + `</p>
                                        </div>
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Cliente</p>
                                            <p class="my-1">` + this.registroVenta.cliente.nombres + ` `+ this.registroVenta.cliente.apellidos +`</p>
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-around mb-2 p-0">
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Metodo de Pago</p>
                                            <p class="my-1">` + this.registroVenta.metodoPago + `</p>
                                        </div>
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Total</p>
                                            <p class="my-1">` + this.registroVenta.total + `</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `,
                            showCancelButton: true,
                            confirmButtonText: "Confirmar",
                            cancelButtonText: "Cancelar",
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.registroVenta.hora = new Date().getHours() + ": " + new Date().getMinutes();
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
                                        .collection("ventas")
                                        .doc("("+this.registroVenta.fecha+")-("+this.registroVenta.hora+")"+"("+this.registroVenta.cliente.documento+")")
                                        .set(this.registroVenta)
                                        .then((result) => {
                                            var usuario = this.registroVenta.cliente
                                            usuario.puntos -= this.registroVenta.total
                                            firebase
                                                .firestore()
                                                .collection("clientes")
                                                .doc(usuario.documento)
                                                .set({ usuario })
                                                .then(() => {
                                                    for(var i in productos){
                                                        productos[i].Cantidad = parseInt(productos[i].Cantidad) - productos[i].cantidadVenta
                                                        delete productos[i].cantidadVenta
                                                        
                                                        firebase
                                                            .firestore()
                                                            .collection("items")
                                                            .doc(productos[i].codigo)
                                                            .set(productos[i])
                                                            .then(() => {
                                                                
                                                            })
                                                    }
                                                    this.$swal.close();
                                                });
                                            this.registroVenta = {
                                                fecha: new Date().toLocaleDateString(),
                                                barbero: null,
                                                cliente: null,
                                                items: [],
                                                metodoPago: "ef",
                                                puntos: 0,
                                                total: 0,
                                            };
                                            this.formatoFecha(this.registroVenta.fecha);
                                            this.filtro = {
                                                barbero: "",
                                                cliente: "",
                                                item: "",
                                                identificador: null,
                                                efectivo: "",
                                            };
                                            this.carrito = [];
                                        })
                                }catch(error){
                                    this.$swal({
                                        icon: "error",
                                        text: error.message
                                    });
                                }
                            }
                        })
                    }
                }

                else if (this.registroVenta.metodoPago === "ef") {
                    if (this.filtro.efectivo >= this.registroVenta.total) {
                        var vueltas = this.filtro.efectivo - this.registroVenta.total;
                        this.$swal({
                            icon: "question",
                            title: "Registrar Venta?",
                            text: "Verifica que la información este bien",
                            html: `
                            <div class="d-flex border flex-column bd-highlight mb-3">
                                <div class="p-2 bd-highlight border">
                                    <div class="d-flex justify-content-around mb-2 p-0">
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Barbero</p>
                                            <p class="my-1">` + this.registroVenta.barbero + `</p>
                                        </div>
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Cliente</p>
                                            <p class="my-1">` + this.registroVenta.cliente.nombres + ` `+ this.registroVenta.cliente.apellidos +`</p>
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-around mb-2 p-0">
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Efectivo</p>
                                            <p class="my-1">` + this.filtro.efectivo + `</p>
                                        </div>
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Total</p>
                                            <p class="my-1">` + this.registroVenta.total + `</p>
                                        </div>
                                    </div>
                                    <div class="d-flex justify-content-around mb-2 p-0">
                                        <div class="m-0">
                                            <p class="border-bottom fst-italic m-0 fw-bolder">Cambio</p>
                                            <p class="my-1">` + vueltas + `</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            `,
                            showCancelButton: true,
                            confirmButtonText: "Confirmar",
                            cancelButtonText: "Cancelar",
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                this.registroVenta.hora = new Date().getHours() + ": " + new Date().getMinutes();
                                this.$swal({
                                    allowEscapeKey: false,
                                    allowOutsideClick: false,
                                    width: auto,
                                    didOpen: () => {
                                        this.$swal.showLoading();
                                    }
                                });
                                
                                try {
                                    firebase
                                        .firestore()
                                        .collection("ventas")
                                        .doc("("+this.registroVenta.fecha+")-("+this.registroVenta.hora+")"+"("+this.registroVenta.cliente.documento+")")
                                        .set(this.registroVenta)
                                        .then((result) => {
                                            var usuario = this.registroVenta.cliente;
                                            if (usuario.puntos === undefined) {
                                                usuario.puntos = this.registroVenta.puntos;
                                            }
                                            else {
                                                usuario.puntos += (this.registroVenta.puntos);
                                            }
                                            if(DiezPorsiento){
                                                clienteDiezPorsiento.puntos += usuario.puntos * 0.1;
                                                clienteDiezPorsiento.puntosReferidos += usuario.puntos * 0.1;
                                            }
                                            firebase
                                                .firestore()
                                                .collection("clientes")
                                                .doc(usuario.documento)
                                                .set({ usuario })
                                                .then(() => {
                                                    for(var i in productos){
                                                        productos[i].Cantidad = parseInt(productos[i].Cantidad) - productos[i].cantidadVenta;
                                                        delete productos[i].cantidadVenta;

                                                        firebase
                                                            .firestore()
                                                            .collection("items")
                                                            .doc(productos[i].codigo)
                                                            .set(productos[i])
                                                            .then(() => {
                                                            });
                                                    }
                                                    if(DiezPorsiento){
                                                        usuario = clienteDiezPorsiento
                                                        firebase
                                                            .firestore()
                                                            .collection("clientes")
                                                            .doc(clienteDiezPorsiento.documento)
                                                            .set({usuario})
                                                            .then(() => {
                                                                this.$swal.close();
                                                            })
                                                    }
                                                    else{
                                                        this.$swal.close();
                                                    }
                                            });
                                            this.registroVenta = {
                                                fecha: new Date().toLocaleDateString(),
                                                barbero: null,
                                                cliente: null,
                                                items: [],
                                                metodoPago: "ef",
                                                puntos: 0,
                                                total: 0,
                                            };
                                            this.formatoFecha(this.registroVenta.fecha);
                                            this.filtro = {
                                                barbero: "",
                                                cliente: "",
                                                item: "",
                                                identificador: null,
                                                efectivo: "",
                                            };
                                            this.carrito = [];
                                    });
                                }
                                catch (error) {
                                    this.$swal({
                                        icon: "error",
                                        text: error.message
                                    });
                                }
                            }
                        });
                    }
                    else {
                        this.$swal({
                            icon: "error",
                            title: "El efectivo proporcionado no es suficiente"
                        });
                    }
                }

                else {
                    this.$swal({
                        icon: "question",
                        title: "Registrar Venta?",
                        text: "Verifica que la información este bien",
                        html: `
                        <div class="d-flex border flex-column bd-highlight mb-3">
                            <div class="p-2 bd-highlight border">
                                <div class="d-flex justify-content-around mb-2 p-0">
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0 fw-bolder">Barbero</p>
                                        <p class="my-1">` + this.registroVenta.barbero + `</p>
                                    </div>
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0 fw-bolder">Cliente</p>
                                        <p class="my-1">` + this.registroVenta.cliente.nombres + ` `+ this.registroVenta.cliente.apellidos +`</p>
                                    </div>
                                </div>

                                <div class="d-flex justify-content-around mb-2 p-0">
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0 fw-bolder">Método de Pago</p>
                                        <p class="my-1">` + this.registroVenta.metodoPago + `</p>
                                    </div>
                                    <div class="m-0">
                                        <p class="border-bottom fst-italic m-0 fw-bolder">Total</p>
                                        <p class="my-1">` + this.registroVenta.total + `</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `,
                        showCancelButton: true,
                        confirmButtonText: "Confirmar",
                        cancelButtonText: "Cancelar",
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            this.registroVenta.hora = new Date().getHours() + ": " + new Date().getMinutes();
                            this.$swal({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                width: auto,
                                didOpen: () => {
                                    this.$swal.showLoading();
                                }
                            });
                            try {
                                firebase
                                    .firestore()
                                    .collection("ventas")
                                    .doc("("+this.registroVenta.fecha+")-("+this.registroVenta.hora+")"+"("+this.registroVenta.cliente.documento+")")
                                    .set(this.registroVenta)
                                    .then((result) => {
                                    var usuario = this.registroVenta.cliente;
                                    if (usuario.puntos === undefined) {
                                        usuario.puntos = this.registroVenta.puntos;
                                    }
                                    else {
                                        usuario.puntos += (this.registroVenta.puntos);
                                    }
                                    if(DiezPorsiento){
                                        clienteDiezPorsiento.puntos += usuario.puntos * 0.1;
                                        clienteDiezPorsiento.puntosReferidos += usuario.puntos * 0.1;
                                    }
                                    firebase
                                        .firestore()
                                        .collection("clientes")
                                        .doc(usuario.documento)
                                        .set({ usuario })
                                        .then(() => {
                                            for(var i in productos){
                                                productos[i].Cantidad = parseInt(productos[i].Cantidad) - productos[i].cantidadVenta;
                                                delete productos[i].cantidadVenta;

                                                firebase
                                                    .firestore()
                                                    .collection("items")
                                                    .doc(productos[i].codigo)
                                                    .set(productos[i])
                                                    .then(() => {
                                                    });
                                            }
                                            if(DiezPorsiento){
                                                usuario = clienteDiezPorsiento
                                                firebase
                                                    .firestore()
                                                    .collection("clientes")
                                                    .doc(clienteDiezPorsiento.documento)
                                                    .set({usuario})
                                                    .then(() => {
                                                        this.$swal.close();
                                                    })
                                            }
                                            else{
                                                this.$swal.close();
                                            }
                                    });
                                    this.registroVenta = {
                                        fecha: new Date().toLocaleDateString(),
                                        barbero: null,
                                        cliente: null,
                                        items: [],
                                        metodoPago: "ef",
                                        puntos: 0,
                                        total: 0,
                                    };
                                    this.formatoFecha(this.registroVenta.fecha);
                                    this.filtro = {
                                        barbero: "",
                                        cliente: "",
                                        item: "",
                                        identificador: null,
                                        efectivo: "",
                                    };
                                    this.carrito = [];
                                });
                            }
                            catch (error) {
                                this.$swal({
                                    icon: "error",
                                    text: error.message
                                });
                            }
                        }
                    });
                }
            }
        },
    },
    setup() {
        const store = useStore();
        return {
            store
        };
    },
    components: { 
        RegistroCliente,
        VentasDia,
        Productos,
        InventarioCaja,
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
a{
    cursor: pointer;
}
</style>