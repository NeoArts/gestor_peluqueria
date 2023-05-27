import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/editEmployee/:id',
    name: 'editEmployee',
    component: () => import('../views/EditEmployee.vue')
  },
  {
    path: '/gestor',
    name: 'gestor',
    component: () => import('../views/Gestor.vue'),
    children: [
      {
        path: '',
        component: () => import("../components/Gestor/HomeGestor.vue")
      },
      {
        path: 'clientes',
        component: () => import("../components/Gestor/Clientes.vue")
      },
      {
        path: 'empleados',
        component: () => import("../components/Gestor/Empleados.vue")
      },
      {
        path: 'inventario',
        component: () => import("../components/Gestor/Inventario.vue")
      },
      {
        path: 'servicios',
        component: () => import("../components/Gestor/Servicios.vue")
      },
      {
        path: 'compras',
        component: () => import("../components/Gestor/Compras.vue")
      }
    ]
  },
  {
    path: '/caja',
    name: 'caja',
    component: () => import("../views/Caja.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
