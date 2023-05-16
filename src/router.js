import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/components/LoginView.vue';
import UserDashboard from '@/components/UserDashboard.vue';
import TransactionView from '@/components/TransactionView.vue';
import RegisterUser from "@/components/RegisterUser";

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
        path: '/register',
        name: 'register',
        component: RegisterUser
    },
    {
        path: '/TransactionView',
        name: 'TransactionView',
        component: TransactionView
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
