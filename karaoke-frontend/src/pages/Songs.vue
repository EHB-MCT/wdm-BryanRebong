<template>
    <div class="songs">
        <h1>{{ formattedGenreName }} Songs</h1>
        <ul v-if="genreSongs">
            <li v-for="song in genreSongs" :key="song.title">
                <span @click="playSong(song)" class="song">
                    🎤 {{ song.title }} — {{ song.artist }}
                </span>
            </li>
        </ul>
        <div v-if="currentSong">
            <h2>{{ currentSong.title }} by {{ currentSong.artist }}</h2>
            <audio :src="currentSong.audio" controls autoplay />
        </div>
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
const currentSong = ref(null);

function playSong(song) {
    if (song.audio) {
        currentSong.value = song;
    } 
}
</script>

<style scoped>
.song {
    cursor: pointer;
}
audio {
    margin-top: 1rem;
    width: 100%;
}
</style>





