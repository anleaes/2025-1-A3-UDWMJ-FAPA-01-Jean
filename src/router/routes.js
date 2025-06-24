const routes = [
   {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Home', component: () => import('pages/Home.vue') },
      { path: 'login', name: 'Login', component: () => import('pages/Login.vue') },
      { path: 'hospedagens', name: 'Hospedagens', component: () => import('pages/Hospedagens.vue') },
      { path: 'clientes', name: 'Clientes', component: () => import('pages/Clientes.vue') },
      { path: 'reservas', name: 'Reservas', component: () => import('pages/Reservas.vue') }


    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
