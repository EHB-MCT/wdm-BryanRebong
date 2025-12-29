<template>
    <div class="songs">
        <h1>{{ formattedGenreName }} Songs</h1>
        <ul v-if="genreSongs">
            <li v-for="song in genreSongs" :key="song.title">
                <router-link :to="`/now-playing/${genreName}/${encodeURIComponent(song.title)}`" class="song">
                    🎤 {{ song.title }} — {{ song.artist }}
                </router-link>
            </li>
        </ul>

    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { songs } from "../data/songs.js";

const route = useRoute();
const genreName = route.params.genre;
const genreSongs = songs[genreName];

const formattedGenreName = genreName.charAt(0).toUpperCase() + genreName.slice(1);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.songs {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
}

.song {
    cursor: pointer;
    text-decoration: none;
    color: inherit;
}

.song:hover {
    color: #646cff;
}
audio {
    margin-top: 1rem;
    width: 100%;
}
</style>





