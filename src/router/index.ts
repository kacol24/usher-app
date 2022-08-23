import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import GuestListTab from '@/views/GuestListTab.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: GuestListTab
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
