import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Genres from "../pages/Genres.vue";
import Songs from "../pages/Songs.vue";
import NowPlaying from "../pages/NowPlaying.vue";
import Score from "../pages/Score.vue";
import Leaderboard from "../pages/Leaderboard.vue";
import AdminControls from "../pages/AdminControls.vue";
import AdminLogin from "../pages/AdminLogin.vue";


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
        beforeEnter: (to, from, next) => {
            const isAuthed = localStorage.getItem('karaoke_admin_authed') === 'true';
            if (isAuthed) {
                next();
            } else {
                next('/admin-login');
            }
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
