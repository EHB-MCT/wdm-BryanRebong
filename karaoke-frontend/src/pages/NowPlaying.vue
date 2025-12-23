<template>
    <div class="now-playing">
        <div v-if="currentSong" class="song-info">
            <h1>{{ currentSong.title }}</h1>
            <h2>by {{ currentSong.artist }}</h2>
            <audio v-if="showAudio && currentSong.audio" ref="audioPlayer" :src="currentSong.audio" controls autoplay @timeupdate="updateLyrics" />
            <div v-else-if="!showAudio && currentSong.audio" class="countdown">
                <p>🎵 Starting in {{ countdown }}...</p>
            </div>
            <div v-else class="no-audio">
                <p>🎵 Audio file not available for this song</p>
                <p>Enjoy the lyrics!</p>
            </div>
            
            <div v-if="currentSong.lyrics && showAudio" class="lyrics-container">
                <div v-for="(lyric, index) in visibleLyrics" :key="index" 
                     :class="['lyric-line', { active: index === activeVisibleIndex, past: index < activeVisibleIndex }]">
                    {{ lyric.text }}
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <p>Loading song...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { songs } from '../data/songs.js';

const route = useRoute();
const router = useRouter();
const genreName = route.params.genre;
const songTitle = decodeURIComponent(route.params.song);

const currentSong = ref(null);
const showAudio = ref(false);
const countdown = ref(5);
const currentLyricIndex = ref(0);
const audioPlayer = ref(null);

onMounted(() => {
    console.log('Looking for song:', songTitle, 'in genre:', genreName);
    const genreSongs = songs[genreName];
    if (genreSongs) {
        const song = genreSongs.find(s => s.title === songTitle);
        console.log('Found song:', song);
        if (song) {
            currentSong.value = song;
            
            if (song.audio) {
                const timer = setInterval(() => {
                    countdown.value--;
                    if (countdown.value <= 0) {
                        clearInterval(timer);
                        showAudio.value = true;
                    }
                }, 1000);
            }
        } else {
            console.log('Song not found:', songTitle, 'Available songs:', genreSongs.map(s => s.title));
            router.push('/genres');
        }
    } else {
        console.log('Genre not found:', genreName);
        router.push('/genres');
    }
});

const visibleLyrics = computed(() => {
    if (!currentSong.value?.lyrics) return [];
    
    const lyrics = currentSong.value.lyrics;
    const startIndex = Math.floor(currentLyricIndex.value / 2) * 2;
    
    return lyrics.slice(startIndex, startIndex + 2);
});

const activeVisibleIndex = computed(() => {
    if (!currentSong.value?.lyrics) return 0;
    
    return currentLyricIndex.value % 2;
});

const updateLyrics = () => {
    if (!currentSong.value?.lyrics || !audioPlayer.value) return;
    
    const currentTime = audioPlayer.value.currentTime;
    const lyrics = currentSong.value.lyrics;
    
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            currentLyricIndex.value = i;
            break;
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.now-playing {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
}

.song-info h1 {
    font-size: 5rem;
    font-weight: 900;
    margin-bottom: 1rem;
}

.song-info h2 {
    font-size: 2.5rem;
    font-weight: 400;
    color: #666;
}

.player h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
}

.player h2 {
    font-size: 1.5rem;
    font-weight: 400;
    color: #666;
    margin-bottom: 2rem;
}

audio {
    width: 100%;
    max-width: 500px;
}

.no-audio {
    margin-top: 2rem;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 10px;
    font-size: 1.2rem;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    font-size: 1.5rem;
}

.countdown {
    margin-top: 2rem;
    padding: 2rem;
    background: #f0f8ff;
    border-radius: 10px;
    font-size: 1.5rem;
    font-weight: bold;
    color: #2c5aa0;
}

.lyrics-container {
    margin-top: 3rem;
    max-width: 600px;
    text-align: center;
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.lyric-line {
    padding: 1rem;
    margin: 0.3rem 0;
    font-size: 2rem;
    color: #666;
    transition: all 0.3s ease;
    border-radius: 8px;
    line-height: 1.4;
}

.lyric-line.active {
    color: #2c5aa0;
    font-weight: bold;
}

.lyric-line.past {
    color: #999;
}
</style>