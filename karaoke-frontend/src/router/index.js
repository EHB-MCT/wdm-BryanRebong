import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Genres from "../pages/Genres.vue";
import Songs from "../pages/Songs.vue";
import NowPlaying from "../pages/NowPlaying.vue";
import Score from "../pages/Score.vue";
import Leaderboard from "../pages/Leaderboard.vue";


const routes = [
    { path: "/", component: Home },          
    { path: "/genres", component: Genres },    
    { path: "/songs/:genre", component: Songs },
    { path: "/now-playing/:genre/:song", component: NowPlaying },
    { path: "/score/:score", component: Score, props: true },
    { path: "/leaderboard", component: Leaderboard }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
