import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/components/LoginView.vue';
import UserDashboard from '@/components/UserDashboard.vue';
import ATM from '@/components/ATM.vue';

const routes = [
    {
        path: '/',
        redirect: '/login' // Setting LoginView as default route
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/userdashboard',
        name: 'userdashboard',
        component: UserDashboard
    },
    {
        path: '/atm',
        name: 'atm',
        component: ATM
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
