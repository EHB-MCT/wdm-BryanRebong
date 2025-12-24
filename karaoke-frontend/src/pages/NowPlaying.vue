<template>
    <div class="now-playing">
        <div v-if="currentSong" class="song-info">
            <h1>{{ currentSong.title }}</h1>
            <h2>by {{ currentSong.artist }}</h2>
            <video v-if="showAudio && currentSong.video" ref="videoPlayer" :src="currentSong.video" autoplay muted loop class="background-video" />
            <audio v-if="showAudio && currentSong.audio" ref="audioPlayer" :src="currentSong.audio" autoplay @timeupdate="updateLyrics" />
            <div v-else-if="!showAudio && currentSong.audio && !countdownStarted" class="start-container">
                <button @click="startCountdown" class="start-button">
                    🎤
                </button>
                <p>Click to start karaoke</p>
            </div>
            <div v-else-if="!showAudio && currentSong.audio && countdownStarted" class="countdown">
                <p>🎵 Starting in {{ countdown }}...</p>
            </div>
            <div v-else class="no-audio">
                <p>🎵 Audio file not available for this song</p>
                <p>Enjoy the lyrics!</p>
            </div>
            
            <div class="mic-controls">
                <button @click="isActive ? stopMicrophoneWithScoring() : startMicrophoneWithScoring()" 
                        :class="['mic-button', { active: isActive }]">
                    {{ isActive ? '🎤' : '🎙️' }}
                </button>
                <p v-if="isActive" class="mic-status">Volume: {{ volume.toFixed(2) }}</p>
                <p v-if="error" class="mic-error">Error: {{ error.message }}</p>
                <p v-if="isScoring" class="scoring-status">🎯 Scoring in progress...</p>
                <p v-if="scoringComplete" class="score-display">🏆 Score: {{ score }}/100</p>
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
import { useMicrophone } from '../composables/useMicrophone.js';
import { useKaraokeScoring } from '../composables/useKaraokeScoring.js';

const route = useRoute();
const router = useRouter();
const genreName = route.params.genre;
const songTitle = decodeURIComponent(route.params.song);

const currentSong = ref(null);
const showAudio = ref(false);
const countdown = ref(5);
const countdownStarted = ref(false);
const currentLyricIndex = ref(0);
const audioPlayer = ref(null);
const videoPlayer = ref(null);
const { startMicrophone, stopMicrophone, isActive, volume, error } = useMicrophone();
const { score, isScoring, scoringComplete, initializeScoring, startScoring, stopScoring, reset } = useKaraokeScoring();

let microphoneStream = null;

onMounted(() => {
    console.log('Looking for song:', songTitle, 'in genre:', genreName);
    const genreSongs = songs[genreName];
    if (genreSongs) {
        const song = genreSongs.find(s => s.title === songTitle);
        console.log('Found song:', song);
        if (song) {
            currentSong.value = song;
        } else {
            console.log('Song not found:', songTitle, 'Available songs:', genreSongs.map(s => s.title));
            router.push('/genres');
        }
    } else {
        console.log('Genre not found:', genreName);
        router.push('/genres');
    }
});

async function startMicrophoneWithScoring() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStream = stream;
        
        // Start regular microphone monitoring
        await startMicrophone();
        
        // Initialize scoring if audio is playing
        if (showAudio.value && audioPlayer.value) {
            await initializeScoring(audioPlayer.value, stream);
            startScoring();
        }
    } catch (err) {
        console.error('Error starting microphone with scoring:', err);
    }
}

function stopMicrophoneWithScoring() {
    stopMicrophone();
    stopScoring();
    
    if (microphoneStream) {
        microphoneStream.getTracks().forEach(track => track.stop());
        microphoneStream = null;
    }
}

const startCountdown = () => {
    if (!currentSong.value?.audio) return;
    
    countdownStarted.value = true;
    countdown.value = 5;
    
const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
            showAudio.value = true;
            // Play audio and video after countdown
            setTimeout(() => {
                if (audioPlayer.value) {
                    audioPlayer.value.play().catch(error => {
                        console.log('Audio playback failed:', error);
                    });
                    
                    // Stop scoring when audio ends and redirect to score page
                    audioPlayer.value.addEventListener('ended', () => {
                        stopScoring();
                        setTimeout(() => {
                            router.push(`/score/${score.value}`);
                        }, 2000); // Wait 2 seconds before redirecting
                    });
                }
                if (videoPlayer.value) {
                    videoPlayer.value.play().catch(error => {
                        console.log('Video playback failed:', error);
                    });
                }
            }, 100);
        }
    }, 1000);
};

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
    color: white;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black,
        -3px 0 0 black,
        3px 0 0 black,
        0 -3px 0 black,
        0 3px 0 black;
}

.song-info h2 {
    font-size: 2.5rem;
    font-weight: 400;
    color: white;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black,
        -3px 0 0 black,
        3px 0 0 black,
        0 -3px 0 black,
        0 3px 0 black;
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
    border-radius: 10px;
    font-size: 1.2rem;
    color: white;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black,
        -3px 0 0 black,
        3px 0 0 black,
        0 -3px 0 black,
        0 3px 0 black;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
    font-size: 1.5rem;
    color: white;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black,
        -3px 0 0 black,
        3px 0 0 black,
        0 -3px 0 black,
        0 3px 0 black;
}

.start-container {
    margin-top: 2rem;
    text-align: center;
}

.start-container p {
    color: white;
    font-size: 1.2rem;
    margin-top: 1rem;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black,
        -3px 0 0 black,
        3px 0 0 black,
        0 -3px 0 black,
        0 3px 0 black;
}



.countdown {
    margin-top: 2rem;
    padding: 2rem;
    border-radius: 10px;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black,
        -3px 0 0 black,
        3px 0 0 black,
        0 -3px 0 black,
        0 3px 0 black;
}

.lyrics-container {
    position: fixed;
    bottom: 2rem;
    left: 5%;
    width: 90%;
    text-align: center;
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.lyric-line {
    padding: 1rem;
    margin: 0.3rem 0;
    font-size: 3rem;
    color: white;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black,
        -3px 0 0 black,
        3px 0 0 black,
        0 -3px 0 black,
        0 3px 0 black;
    transition: all 0.3s ease;
    border-radius: 8px;
    line-height: 1.4;
}

.lyric-line.active {
    color: #87CEEB;
    font-weight: bold;
}

.lyric-line.past {
    color: white;
}

.background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
}

.mic-controls {
    position: fixed;
    top: 2rem;
    right: 2rem;
    text-align: right;
    z-index: 10;
}



.mic-status {
    color: white;
    font-size: 0.9rem;
    margin: 0.3rem 0;
    text-shadow: 
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black;
}

.mic-error {
    color: #ff6b6b;
    font-size: 0.9rem;
    margin: 0.3rem 0;
    text-shadow: 
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black;
}

.scoring-status {
    color: #4CAF50;
    font-size: 0.9rem;
    margin: 0.3rem 0;
    text-shadow: 
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black;
}

.score-display {
    color: #FFD700;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0.3rem 0;
    text-shadow: 
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black;
}
</style>