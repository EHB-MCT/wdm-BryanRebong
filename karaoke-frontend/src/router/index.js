import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Genres from "../pages/Genres.vue";
import Songs from "../pages/Songs.vue";
import NowPlaying from "../pages/NowPlaying.vue";

const routes = [
  { path: "/", component: Home },          
  { path: "/genres", component: Genres },    
  { path: "/songs/:genre", component: Songs },
  { path: "/now-playing/:genre/:song", component: NowPlaying }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
