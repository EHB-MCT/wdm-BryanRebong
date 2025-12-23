<template>
    <div class="genres">
        <h1>Select a Genre</h1>
        <ul>
        <li v-for="genre in genreList" :key="genre">
            <router-link :to="`/songs/${genre}`">
            {{ showGenreName(genre) }}
            </router-link>
        </li>
        </ul>
    </div>
</template>

<script setup>
import {songs} from "../data/songs.js";

const genreList = Object.keys(songs);

const showGenreName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.genres {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
}
</style>

