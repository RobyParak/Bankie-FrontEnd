import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/components/LoginView.vue';
import UserDashboard from '@/components/UserDashboard.vue';
import Transaction from '@/components/TransactionView.vue';
import EmployeeDashboard from '@/components/EmployeeDashboard.vue';

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
        path: '/TransactionView',
        name: 'TransactionView',
        component: Transaction
    },
    {
        path: '/EmployeeDashboard',
        name: 'EmployeeDashboard',
        component: EmployeeDashboard
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
