import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Genres from "../pages/Genres.vue";
import Songs from "../pages/Songs.vue";

const routes = [
    { path: "/", component: home},
    { path: "/genres", component: genre},
    { path: "/songs/:genre", component: Songs},
];

const router = createRouter ({
    history: createWebHistory(),
    routes,
});

export default router;