<template>
    <div class="genres">
        <h1>Select a Genre</h1>
        <ul>
<li v-for="genre in genreList" :key="genre">
            <router-link :to="`/songs/${genre}`" @click="handleGenreClick(genre)">
            {{ showGenreName(genre) }}
            </router-link>
        </li>
        </ul>
    </div>
</template>

<script setup>
import {songs} from "../data/songs.js";
import { incrementGenrePlay } from "../utils/trackAnalytics.js";

const genreList = Object.keys(songs);

const showGenreName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
};

const handleGenreClick = (genre) => {
    incrementGenrePlay(genre);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.genres {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    background: transparent;
}

.genres h1 {
    color: white;
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 3rem;
    text-shadow: 
        -2px -2px 0 rgba(0, 0, 0, 0.8),
        2px -2px 0 rgba(0, 0, 0, 0.8),
        -2px 2px 0 rgba(0, 0, 0, 0.8),
        2px 2px 0 rgba(0, 0, 0, 0.8);
}

.genres ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    width: 100%;
}

.genres li {
    text-align: center;
}

.genres a {
    display: block;
    padding: 2rem 3rem;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
    font-weight: bold;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.genres a:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
</style>

