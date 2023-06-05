import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/components/LoginView.vue';
import UserDashboard from '@/components/UserDashboard.vue';
import TransactionView from '@/components/TransactionView.vue';
import RegisterUser from "@/components/RegisterUser";
import EmployeeDashboard from "@/components/EmployeeDashboard";
import SuccessfulRegistration from "@/components/SuccessfulRegistration.vue";


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
        path: '/Transaction',
        name: 'Transaction',
        component: TransactionView
    },
    {
        path: '/EmployeeDashboard',
        name: 'EmployeeDashboard',
        component: EmployeeDashboard
    },
    {
        path: '/success',
        name: 'SuccessfulRegistration',
        component: SuccessfulRegistration
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
