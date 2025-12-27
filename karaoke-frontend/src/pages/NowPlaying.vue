<template>
    <div class="now-playing">
        <div v-if="currentSong" class="song-info">
            <div v-if="showAudio" class="volume-display">
                Volume: {{ volume.toFixed(2) }}
            </div>
<h1>{{ currentSong.title }}</h1>
            <h2>by {{ currentSong.artist }}</h2>
            <video v-if="showAudio && currentSong.video" ref="videoPlayer" :src="currentSong.video" autoplay muted loop class="background-video" />
            <audio v-if="showAudio && currentSong.audio" ref="audioPlayer" :src="currentSong.audio" autoplay @timeupdate="updateLyrics" @ended="handleSongEnded" />
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
        
        <!-- Challenge Popup -->
        <div v-if="currentChallenge" class="challenge-popup" :style="{ left: challengePosition.x + '%', top: challengePosition.y + '%' }">
            <div class="challenge-content">
                <h3>🎯 VOCAL CHALLENGE!</h3>
                <p>{{ currentChallenge.text }}</p>
                <div class="challenge-timer">
                    <div class="timer-bar" :style="{ width: getChallengeProgress() + '%' }"></div>
                </div>
                <div class="challenge-status">
                    <div class="status-indicator" :class="getChallengeStatus()">
                        {{ getChallengeStatusText() }}
                    </div>
                </div>
            </div>
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
const { isActive, volume, error, startMicrophone, stopMicrophone } = useMicrophone();
const { score, isScoring, scoringComplete, initializeScoring, startScoring, stopScoring, reset } = useKaraokeScoring();

// Challenge system
const currentChallenge = ref(null);
const challengeBonus = ref(0);
const challengeTimeout = ref(null);
const challengePosition = ref({ x: 50, y: 50 });

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

const startCountdown = async () => {
    if (!currentSong.value?.audio) return;
    
    countdownStarted.value = true;
    countdown.value = 5;
    
    const timer = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(timer);
            showAudio.value = true;
            
            setTimeout(async () => {
                try {
                    // Start microphone and get stream
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    await startMicrophone();
                    
                    if (audioPlayer.value && stream) {
                        await initializeScoring(audioPlayer.value, stream);
                        startScoring();
                        
                    audioPlayer.value.play().catch(error => {
                        console.log('Audio playback failed:', error);
                    });
                    
                    // Start challenge system
                    startRandomChallenges();
                    }
                    if (videoPlayer.value) {
                        videoPlayer.value.play().catch(error => {
                            console.log('Video playback failed:', error);
                        });
                    }
                } catch (error) {
                    console.error('Error setting up scoring:', error);
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

// Challenge system
const challenges = [
    { text: "Sing with HIGH PITCH for the next 8 seconds!", type: "high_pitch", duration: 8000, bonus: 10 },
    { text: "WHISPER quietly for the next 6 seconds!", type: "whisper", duration: 6000, bonus: 8 },
    { text: "Sing with EXTRA LOUD volume for 7 seconds!", type: "loud", duration: 7000, bonus: 9 },
    { text: "Use your DEEP voice for 8 seconds!", type: "deep_pitch", duration: 8000, bonus: 8 },
    { text: "Sing with CONSISTENT volume for 10 seconds!", type: "consistent", duration: 10000, bonus: 12 }
];

// Challenge monitoring data
const challengeData = ref([]);
const challengeInterval = ref(null);

const startRandomChallenges = () => {
    const scheduleNextChallenge = () => {
        if (!showAudio.value || !audioPlayer.value) return;
        
        // Random delay between 15-30 seconds
        const delay = Math.random() * 15000 + 15000;
        
        setTimeout(() => {
            if (!showAudio.value || !audioPlayer.value) return;
            
            // Select random challenge
            const challenge = challenges[Math.floor(Math.random() * challenges.length)];
            showChallenge(challenge);
            
            // Schedule next challenge if song is still playing
            if (audioPlayer.value.currentTime < audioPlayer.value.duration - 20) {
                scheduleNextChallenge();
            }
        }, delay);
    };
    
    scheduleNextChallenge();
};

const showChallenge = (challenge) => {
    // Random position on screen (avoiding edges)
    challengePosition.value = {
        x: Math.random() * 60 + 20, // 20-80% of screen width
        y: Math.random() * 40 + 20  // 20-60% of screen height
    };
    
    currentChallenge.value = { ...challenge, startTime: Date.now() };
    challengeData.value = []; // Reset challenge data
    
    // Start monitoring challenge performance
    startChallengeMonitoring();
    
    // Auto-complete challenge after duration
    challengeTimeout.value = setTimeout(() => {
        completeChallenge();
    }, challenge.duration);
};

const startChallengeMonitoring = () => {
    challengeData.value = [];
    let intervalCount = 0;
    
    challengeInterval.value = setInterval(() => {
        if (!currentChallenge.value || !volume.value) return;
        
        challengeData.value.push({
            volume: volume.value,
            timestamp: Date.now()
        });
        
        intervalCount++;
    }, 100); // Sample every 100ms
};

const completeChallenge = () => {
    if (!currentChallenge.value) return;
    
    const success = evaluateChallenge();
    const result = success ? 'COMPLETED' : 'FAILED';
    
    if (success) {
        challengeBonus.value += currentChallenge.value.bonus;
        console.log(`Challenge ${result}! +${currentChallenge.value.bonus} bonus points`);
    } else {
        console.log(`Challenge ${result}! No bonus points`);
    }
    
    // Store challenge result for final display
    currentChallenge.value.result = success ? 'completed' : 'failed';
    currentChallenge.value.earned = success ? currentChallenge.value.bonus : 0;
    
    // Add to completed challenges list
    if (!window.completedChallenges) {
        window.completedChallenges = [];
    }
    window.completedChallenges.push({
        text: currentChallenge.value.text,
        bonus: currentChallenge.value.bonus,
        result: currentChallenge.value.result,
        earned: currentChallenge.value.earned
    });
    
    currentChallenge.value = null;
    
    if (challengeTimeout.value) {
        clearTimeout(challengeTimeout.value);
        challengeTimeout.value = null;
    }
    
    if (challengeInterval.value) {
        clearInterval(challengeInterval.value);
        challengeInterval.value = null;
    }
};

const evaluateChallenge = () => {
    if (!currentChallenge.value || challengeData.value.length === 0) return false;
    
    const volumes = challengeData.value.map(d => d.volume);
    const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
    const variance = volumes.reduce((sum, v) => sum + Math.pow(v - avgVolume, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);
    
    switch (currentChallenge.value.type) {
        case 'high_pitch':
            // High pitch usually has higher frequency components - we'll approximate with volume variance
            return avgVolume > 15 && stdDev > 8;
            
        case 'whisper':
            // Whisper should be very quiet and consistent
            return avgVolume < 8 && stdDev < 3;
            
        case 'loud':
            // Loud singing should be high volume
            return avgVolume > 25;
            
        case 'deep_pitch':
            // Deep voice approximation - lower variance, moderate volume
            return avgVolume > 12 && avgVolume < 25 && stdDev < 6;
            
        case 'consistent':
            // Consistent volume should have low standard deviation
            return stdDev < 4 && avgVolume > 10;
            
        default:
            return false;
    }
};

const getChallengeProgress = () => {
    if (!currentChallenge.value) return 0;
    
    const elapsed = Date.now() - currentChallenge.value.startTime;
    const progress = (elapsed / currentChallenge.value.duration) * 100;
    return Math.max(0, Math.min(100, 100 - progress));
};

const getChallengeStatus = () => {
    if (!currentChallenge.value || challengeData.value.length === 0) return 'waiting';
    
    const volumes = challengeData.value.map(d => d.volume);
    const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
    const variance = volumes.reduce((sum, v) => sum + Math.pow(v - avgVolume, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);
    
    switch (currentChallenge.value.type) {
        case 'high_pitch':
            return (avgVolume > 15 && stdDev > 8) ? 'success' : 'trying';
        case 'whisper':
            return (avgVolume < 8 && stdDev < 3) ? 'success' : 'trying';
        case 'loud':
            return avgVolume > 25 ? 'success' : 'trying';
        case 'deep_pitch':
            return (avgVolume > 12 && avgVolume < 25 && stdDev < 6) ? 'success' : 'trying';
        case 'consistent':
            return (stdDev < 4 && avgVolume > 10) ? 'success' : 'trying';
        default:
            return 'waiting';
    }
};

const getChallengeStatusText = () => {
    const status = getChallengeStatus();
    switch (status) {
        case 'success': return '🎯 PERFECT!';
        case 'trying': return '🎤 KEEP GOING!';
        case 'waiting': return '⏳ PREPARING...';
        default: return '⏳ PREPARING...';
    }
};

const handleSongEnded = () => {
    stopScoring();
    stopMicrophone();
    if (challengeTimeout.value) {
        clearTimeout(challengeTimeout.value);
    }
    if (challengeInterval.value) {
        clearInterval(challengeInterval.value);
        challengeInterval.value = null;
    }
    
    const finalScore = score.value + challengeBonus.value;
    const completedChallenges = window.completedChallenges || [];
    
    // Store score breakdown for display
    localStorage.setItem('karaokeScoreBreakdown', JSON.stringify({
        baseScore: score.value,
        bonusScore: challengeBonus.value,
        totalScore: finalScore,
        challenges: completedChallenges
    }));
    
    setTimeout(() => {
        router.push(`/score/${finalScore}`);
    }, 500);
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

.volume-display {
    position: fixed;
    top: 1rem;
    left: 1rem;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    background: rgba(0, 0, 0, 0.7);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    text-shadow: 
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black;
    z-index: 10;
}

.challenge-popup {
    position: fixed;
    transform: translate(-50%, -50%);
    z-index: 1000;
    animation: popupAppear 0.5s ease-out;
}

@keyframes popupAppear {
    0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }
    100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
}

.challenge-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1.5rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    text-align: center;
    min-width: 300px;
    max-width: 400px;
    border: 3px solid #ffd700;
}

.challenge-content h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.challenge-content p {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.4;
}

.challenge-timer {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    margin: 1rem 0;
    overflow: hidden;
}

.timer-bar {
    height: 100%;
    background: linear-gradient(90deg, #ffd700, #ffed4e);
    transition: width 0.1s linear;
    border-radius: 4px;
}

.challenge-status {
    margin-top: 1rem;
}

.status-indicator {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.status-indicator.waiting {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.status-indicator.trying {
    background: rgba(255, 193, 7, 0.3);
    color: #ffc107;
    border: 1px solid #ffc107;
}

.status-indicator.success {
    background: rgba(76, 175, 80, 0.3);
    color: #4caf50;
    border: 1px solid #4caf50;
}
</style>