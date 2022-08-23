import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import GuestListTab from '@/views/GuestListTab.vue';
import GuestCheckIn from '@/views/GuestCheckIn.vue';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: GuestListTab
    },
    {
        path: '/invitations/:guest_code',
        name: 'invitations.show',
        component: GuestCheckIn
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
