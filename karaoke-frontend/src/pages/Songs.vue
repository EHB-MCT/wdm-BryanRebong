<template>
    <div class="songs">
        <div class="header-bar">
            <button class="return-btn" @click="goToGenres">
                Return
            </button>
            <h1>{{ formattedGenreName }}</h1>
            <div class="username-spacer"></div>
        </div>
        
        <!-- Arcade-style infinite carousel -->
        <SongCarousel v-if="genreSongs" :songs="genreSongs" />
        
        <!-- Fallback message if no songs -->
        <div v-else class="no-songs">
            <p>No songs found for this genre.</p>
            <router-link to="/genres" class="back-link">← Back to Genres</router-link>
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 2rem 0.5rem 2rem;
    position: relative;
    z-index: 10;
    background: transparent;
}

.return-btn {
    padding: 10px 14px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    background: #ff6b6b;
    color: white;
    font-weight: 600;
}

.username-spacer {
    flex: 1;
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
    flex: 1;
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

.back-link {
    color: #ffd700;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: bold;
    padding: 10px 20px;
    border: 2px solid #ffd700;
    border-radius: 25px;
    transition: all 0.3s ease;
}

.back-link:hover {
    background: #ffd700;
    color: #333;
    transform: scale(1.05);
}

/* Responsive design */
@media (max-width: 768px) {
    .header-bar {
        padding: 1rem 1.5rem 0.5rem 1.5rem;
    }
    
    h1 {
        font-size: 2.5rem;
    }
}

@media (max-width: 480px) {
    .header-bar {
        padding: 0.8rem 1rem 0.3rem 1rem;
    }
    
    h1 {
        font-size: 2rem;
    }
}
</style>





