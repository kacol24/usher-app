import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import GuestListTab from '@/views/GuestListTab.vue';
import UsherList from '@/views/UsherList.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: GuestListTab
    },
    {
        path: '/set-usher',
        component: UsherList,
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
