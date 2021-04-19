import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [


  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Login.vue'),
      }
    ]
  },
  {
    path: '/register',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Register.vue'),
      }
    ]
  },
  {
    path: '/verify',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Verify.vue'),
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '', component: () => import('pages/Profil.vue'),
        meta: { requiresAuth:true ,title:'Informations Utilisateur'}
      }
    ]
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
