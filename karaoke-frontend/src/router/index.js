import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Genres from "../pages/Genres.vue";
import Songs from "../pages/Songs.vue";
import NowPlaying from "../pages/NowPlaying.vue";
import Score from "../pages/Score.vue";
import Leaderboard from "../pages/Leaderboard.vue";
import AdminControls from "../pages/AdminControls.vue";
import AdminLogin from "../pages/AdminLogin.vue";
import AdminCharts from "../pages/AdminCharts.vue";
import AdminSongs from "../pages/AdminSongs.vue";


const adminAuthGuard = (to, from, next) => {
    const isAuthed = localStorage.getItem('karaoke_admin_authed') === 'true';
    if (isAuthed) {
        next();
    } else {
        next('/admin-login');
    }
};

const routes = [
    { path: "/", component: Home },          
    { path: "/genres", component: Genres },    
    { path: "/songs/:genre", component: Songs },
    { path: "/now-playing/:genre/:song", component: NowPlaying },
    { path: "/score/:score", component: Score, props: true },
    { path: "/leaderboard", component: Leaderboard },
    { path: "/admin-login", component: AdminLogin },
    { 
        path: "/admin", 
        component: AdminControls,
        beforeEnter: adminAuthGuard
    },
    {
        path: "/admin/charts",
        component: AdminCharts,
        beforeEnter: adminAuthGuard
    },
    {
        path: "/admin/songs",
        component: AdminSongs,
        beforeEnter: adminAuthGuard
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
