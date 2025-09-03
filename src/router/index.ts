import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import GameView from '../pages/GameView.vue';
import GameHub from '../pages/GameHub.vue';
import GameLeaderboard from '../pages/GameLeaderboard.vue';

const routes : RouteRecordRaw[] = [
    { path: '/', redirect: '/hub' },
    { path: '/hub', component: GameHub },
    { path: '/game', component: GameView },
    { path: '/podium', component: GameLeaderboard}
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;