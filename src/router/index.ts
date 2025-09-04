import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

import GameView from '../pages/GameView.vue';
import GameHub from '../pages/GameHub.vue';
import GameLeaderboard from '../pages/GameLeaderboard.vue';
import GameSettings from '../pages/GameSettings.vue';

const routes : RouteRecordRaw[] = [
    { path: '/', redirect: '/hub' },
    { path: '/hub', component: GameHub },
    { path: '/game', component: GameView },
    { path: '/leaderboard', component: GameLeaderboard},
    { path: '/settings', component: GameSettings}
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;