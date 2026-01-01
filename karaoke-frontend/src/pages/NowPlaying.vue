<template>
<div class="now-playing">
        <div class="header-bar">
            <button class="btn-standard" @click="handleReturn">
                Return
            </button>
        </div>
        <div v-if="currentSong" class="song-info">
            <div v-if="showAudio" class="volume-display">
                Volume: {{ volume.toFixed(2) }}
            </div>
<h1>{{ currentSong.title }}</h1>
            <h2>by {{ currentSong.artist }}</h2>
<video
    v-if="showAudio && currentSong.video"
    ref="videoPlayer"
    :src="currentSong.video"
    autoplay
    muted
    loop
    playsinline
    class="background-video"
/>
    <audio
        v-if="showAudio && currentSong.audio"
        ref="audioPlayer"
        :src="currentSong.audio"
        autoplay
        @ended="handleSongEnded"
    />
            <div v-else-if="!showAudio && currentSong.audio && !countdownStarted" class="start-container">
<button @click="startCountdown" class="btn-compact">
                    🎤 Start
                </button>
                <p>Click to play the song</p>
            </div>
            <div v-else-if="!showAudio && currentSong.audio && countdownStarted" class="countdown">
                <p>🎵 Starting in {{ countdown }}...</p>
            </div>
            <div v-else class="no-audio">
                <p>🎵 Audio file not available for this song</p>
                <p>Enjoy the music!</p>
            </div>

        </div>
        <div v-else class="loading">
            <p>Loading song...</p>
        </div>
        
        <div v-if="currentChallenge" class="challenge-popup" :class="getChallengeStatus()" :style="{ left: challengePosition.x + '%', top: challengePosition.y + '%' }">
            <div class="challenge-content">
                <h3>🎯 VOCAL CHALLENGE!</h3>
                <p>{{ currentChallenge.text }}</p>
                <div class="challenge-timer">
                    <div class="timer-bar" :class="getChallengeStatus()" :style="{ width: getChallengeProgress() + '%' }"></div>
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { songs } from '../data/songs.js';
import { useMicrophone } from '../composables/useMicrophone.js';
import { useKaraokeScoring } from '../composables/useKaraokeScoring.js';
import { useSession } from '../composables/useSession.js';

const route = useRoute();
const router = useRouter();
const genreName = route.params.genre;
const songTitle = decodeURIComponent(route.params.song);

const currentSong = ref(null);
const showAudio = ref(false);
const countdown = ref(5);
const countdownStarted = ref(false);

const audioPlayer = ref(null);
const videoPlayer = ref(null);
const { isActive, volume, error, startMicrophone, stopMicrophone } = useMicrophone();
const { score, isScoring, scoringComplete, initializeScoring, startScoring, stopScoring, reset } = useKaraokeScoring();
const { addCompletedChallenge, addToTotalScore } = useSession();

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
            // Store current song info for retry functionality
            localStorage.setItem('lastPlayedSong', JSON.stringify({
                title: song.title,
                artist: song.artist,
                genre: genreName
            }));
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
                       
                    // Play both audio and video at the same time
                    audioPlayer.value.play().catch(error => {
                        console.log('Audio playback failed:', error);
                    });
                    
                    if (videoPlayer.value) {
                        videoPlayer.value.play().catch(error => {
                            console.log('Video playback failed:', error);
                        });
                    }
                    
                    // Start challenge system
                    startRandomChallenges();
                    }
                } catch (error) {
                    console.error('Error setting up scoring:', error);
                }
            }, 100);
        }
    }, 1000);
};



// Challenge system
const challenges = [
    { text: "Sing with HIGH PITCH for the next 8 seconds!", type: "high_pitch", duration: 8000, bonus: 10 },
    { text: "WHISPER quietly for the next 6 seconds!", type: "whisper", duration: 6000, bonus: 8 },
    { text: "Sing with EXTRA LOUD volume for 7 seconds!", type: "loud", duration: 7000, bonus: 9 },
    { text: "Use your DEEP voice for 8 seconds!", type: "deep_pitch", duration: 8000, bonus: 8 },
    { text: "Stay COMPLETELY SILENT for 5 seconds!", type: "silent", duration: 5000, bonus: 12 }
];

// Reading and timing states
const readingTime = 2000; // 2 seconds reading time
const resultDisplayTime = 2000; // 2 seconds to show result

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
    
    // Generate unique challenge ID
    const challengeId = crypto.randomUUID();
    
    currentChallenge.value = { 
        ...challenge, 
        challengeId,
        startTime: Date.now(),
        readingPeriod: true,
        actualStartTime: null,
        showResult: false,
        result: null
    };
    challengeData.value = []; // Reset challenge data
    
    // Start reading period countdown
    challengeTimeout.value = setTimeout(() => {
        startChallengeMonitoring();
        currentChallenge.value.readingPeriod = false;
        currentChallenge.value.actualStartTime = Date.now();
        
        // Auto-complete challenge after actual duration
        challengeTimeout.value = setTimeout(() => {
            completeChallenge();
        }, challenge.duration);
    }, readingTime);
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
    
    // Show result for 2 seconds before hiding
    currentChallenge.value.showResult = true;
    currentChallenge.value.result = success ? 'success' : 'failed';
    currentChallenge.value.statusText = success ? '✅ COMPLETED!' : '❌ MISSED!';
    
    // Store challenge result for final display
    const finalResult = success ? 'completed' : 'failed';
    const earnedPoints = success ? currentChallenge.value.bonus : 0;
    
if (success) {
        challengeBonus.value += currentChallenge.value.bonus;
        const wasAdded = addCompletedChallenge(currentChallenge.value.challengeId);
        if (wasAdded) {
            console.log(`Challenge ${result}! +${currentChallenge.value.bonus} bonus points (ID: ${currentChallenge.value.challengeId})`);
        } else {
            console.log(`Challenge ${result}! Already counted (ID: ${currentChallenge.value.challengeId})`);
        }
    } else {
        console.log(`Challenge ${result}! No bonus points`);
    }
    
    // Add to completed challenges list
    if (!window.completedChallenges) {
        window.completedChallenges = [];
    }
    window.completedChallenges.push({
        text: currentChallenge.value.text,
        bonus: currentChallenge.value.bonus,
        result: finalResult,
        earned: earnedPoints
    });
    
    // Hide popup after showing result
    setTimeout(() => {
        currentChallenge.value = null;
        
        if (challengeTimeout.value) {
            clearTimeout(challengeTimeout.value);
            challengeTimeout.value = null;
        }
        
        if (challengeInterval.value) {
            clearInterval(challengeInterval.value);
            challengeInterval.value = null;
        }
    }, resultDisplayTime);
};

const evaluateChallenge = () => {
    if (!currentChallenge.value || challengeData.value.length === 0) return false;
    
    const volumes = challengeData.value.map(d => d.volume);
    const avgVolume = volumes.reduce((sum, v) => sum + v, 0) / volumes.length;
    const variance = volumes.reduce((sum, v) => sum + Math.pow(v - avgVolume, 2), 0) / volumes.length;
    const stdDev = Math.sqrt(variance);
    
    // Also check for peak volumes during the challenge
    const peakVolume = Math.max(...volumes);
    
    switch (currentChallenge.value.type) {
        case 'high_pitch':
            // Lower threshold and focus on variance more
            return (avgVolume > 12 && stdDev > 6);
        case 'whisper':
            // More forgiving whisper detection
            return (avgVolume < 12 && stdDev < 4);
        case 'loud':
            // Much more forgiving - either average OR peak volume
            return (avgVolume > 18 || peakVolume > 30);
        case 'deep_pitch':
            // Wider range for deep voice
            return (avgVolume > 10 && avgVolume < 30 && stdDev < 8);
case 'silent':
            // Must stay very quiet (near silence)
            return (avgVolume < 5 && peakVolume < 8);
        default:
            return false;
    }
};

const getChallengeProgress = () => {
    if (!currentChallenge.value) return 0;
    
    if (currentChallenge.value.readingPeriod) {
        // Show reading period progress
        const elapsed = Date.now() - currentChallenge.value.startTime;
        const progress = (elapsed / readingTime) * 100;
        return Math.max(0, Math.min(100, 100 - progress));
    } else {
        // Show challenge progress
        const elapsed = Date.now() - currentChallenge.value.actualStartTime;
        const progress = (elapsed / currentChallenge.value.duration) * 100;
        return Math.max(0, Math.min(100, 100 - progress));
    }
};

const getChallengeStatus = () => {
    if (currentChallenge.value.showResult) {
        return currentChallenge.value.result;
    }
    
    if (currentChallenge.value.readingPeriod) {
        return 'reading';
    }
    
    return 'active'; // Always show neutral status during challenge
};

const getChallengeStatusText = () => {
    if (currentChallenge.value.showResult) {
        return currentChallenge.value.statusText;
    }
    
    if (currentChallenge.value.readingPeriod) {
        return '📖 GET READY...';
    }
    
    return '🎤 SING NOW!'; // Always show this during challenge
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
    
    // Add to session total score
    addToTotalScore(finalScore);
    
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

const handleReturn = () => {
    if (showAudio.value === true) {
        // During playback: stop playback and reset state
        if (audioPlayer.value) {
            audioPlayer.value.pause();
            audioPlayer.value.currentTime = 0;
        }
        if (videoPlayer.value) {
            videoPlayer.value.pause();
            videoPlayer.value.currentTime = 0;
        }
        
        // Stop scoring and microphone
        stopScoring();
        stopMicrophone();
        
        // Clear challenges
        if (challengeTimeout.value) {
            clearTimeout(challengeTimeout.value);
            challengeTimeout.value = null;
        }
        if (challengeInterval.value) {
            clearInterval(challengeInterval.value);
            challengeInterval.value = null;
        }
        currentChallenge.value = null;
        
        // Reset state to show title/artist view with Start button
        showAudio.value = false;
        countdownStarted.value = false;
        countdown.value = 5;
    } else {
        // Before playback: navigate back to songs carousel for the same genre
        router.push(`/songs/${route.params.genre}`);
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.now-playing {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-height: 100vh;
    text-align: center;
    color: white;
}

.header-bar {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding: 1.5rem 2rem 0.5rem 2rem;
    position: relative;
    z-index: 10;
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



.background-video {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
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
    transition: all 0.3s ease;
}

.challenge-popup.success {
    animation: popupSuccess 0.5s ease-out;
}

.challenge-popup.failed {
    animation: popupFailed 0.5s ease-out;
}

@keyframes popupSuccess {
    0% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
    100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes popupFailed {
    0% { transform: translate(-50%, -50%) scale(1); }
    25% { transform: translate(-50%, -50%) translateX(-5px); }
    50% { transform: translate(-50%, -50%) translateX(5px); }
    75% { transform: translate(-50%, -50%) translateX(-5px); }
    100% { transform: translate(-50%, -50%) translateX(0); }
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
    transition: all 0.3s ease;
}

.challenge-popup.success .challenge-content,
.challenge-popup.failed .challenge-content {
    transition: all 0.3s ease;
}

.challenge-popup.success .challenge-content {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    border-color: #4caf50;
    box-shadow: 0 10px 40px rgba(76, 175, 80, 0.5);
}

.challenge-popup.failed .challenge-content {
    background: linear-gradient(135deg, #f44336 0%, #da190b 100%);
    border-color: #f44336;
    box-shadow: 0 10px 40px rgba(244, 67, 54, 0.5);
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

.challenge-popup.success .timer-bar {
    background: linear-gradient(90deg, #4caf50, #66bb6a);
}

.challenge-popup.failed .timer-bar {
    background: linear-gradient(90deg, #f44336, #ef5350);
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

.status-indicator.reading {
    background: rgba(255, 193, 7, 0.3);
    color: #ffc107;
    border: 1px solid #ffc107;
}

.status-indicator.active {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.challenge-popup.success .status-indicator {
    background: rgba(76, 175, 80, 0.3);
    color: #4caf50;
    border: 1px solid #4caf50;
}

.challenge-popup.failed .status-indicator {
    background: rgba(244, 67, 54, 0.3);
    color: #f44336;
    border: 1px solid #f44336;
}
</style>