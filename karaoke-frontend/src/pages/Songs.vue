<template>
    <div class="songs">
<div class="header-bar">
            <div class="header-left">
                <button class="btn-standard" @click="goToGenres">
                    Return
                </button>
            </div>
            <h1>{{ formattedGenreName }}</h1>
            <div class="header-right"></div>
        </div>
        
        <SongCarousel v-if="genreSongs" :songs="genreSongs" />
        
        <div v-else class="no-songs">
            <p>No songs found for this genre.</p>
            <router-link to="/genres" class="btn-compact">← Back to Genres</router-link>
        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { songs } from "../data/songs.js";
import SongCarousel from "../components/SongCarousel.vue";

const route = useRoute();
const router = useRouter();
const genreName = route.params.genre;
const genreSongs = songs[genreName];

const formattedGenreName = genreName.charAt(0).toUpperCase() + genreName.slice(1);

const goToGenres = () => {
    router.push('/genres');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.songs {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: transparent;
}

.header-bar {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 1.5rem 2rem 0.5rem 2rem;
    position: relative;
    z-index: 10;
    background: transparent;
}

/* Return button now uses .btn-standard from global styles */

.header-left {
    display: flex;
    justify-content: flex-start;
}

.header-right {
    display: flex;
    justify-content: flex-end;
}

h1 {
    color: white;
    font-size: 3rem;
    font-weight: 900;
    margin: 0;
    text-shadow: 
        -2px -2px 0 rgba(0, 0, 0, 0.8),
        2px -2px 0 rgba(0, 0, 0, 0.8),
        -2px 2px 0 rgba(0, 0, 0, 0.8),
        2px 2px 0 rgba(0, 0, 0, 0.8);
    text-align: center;
}

.no-songs {
    text-align: center;
    color: white;
    padding: 4rem 2rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.no-songs p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    opacity: 0.8;
}

/* Back link now uses .btn-compact from global styles */
</style>





