<template>
    <div class="score-page">
        <div class="score-container">
            <h1>Performance Complete!</h1>
            
            <div class="score-display">
                <div class="score-number">{{ score }}</div>
                <div class="score-message">{{ getScoreMessage() }}</div>
            </div>
            
            <div v-if="scoreBreakdown" class="score-breakdown">
                <h3>📊 Score Breakdown</h3>
                <div class="breakdown-item">
                    <span>Base Score:</span>
                    <span>{{ scoreBreakdown.baseScore }}</span>
                </div>
                <div class="breakdown-item bonus">
                    <span>🎯 Bonus Points:</span>
                    <span>+{{ scoreBreakdown.bonusScore }}</span>
                </div>
                <div class="breakdown-item total">
                    <span><strong>Total Score:</strong></span>
                    <span><strong>{{ scoreBreakdown.totalScore }}</strong></span>
                </div>
                
                <div v-if="scoreBreakdown.challenges.length > 0" class="challenges-summary">
                    <h4>Challenges Attempted:</h4>
                    <div v-for="challenge in scoreBreakdown.challenges" :key="challenge.text" 
                         class="challenge-result" :class="challenge.result">
                        <div class="challenge-text">{{ challenge.text }}</div>
                        <div class="challenge-points">
                            {{ challenge.result === 'completed' ? `+${challenge.earned}` : 'Missed' }}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="actions">
<router-link v-if="lastSong" :to="`/now-playing/${lastSong.genre}/${encodeURIComponent(lastSong.title)}`" class="action-button">
                    Retry Song
                </router-link>
                <router-link to="/genres" class="action-button">
                    Choose Another Song
                </router-link>
                <router-link to="/" class="action-button secondary">
                    Back to Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSession } from '../composables/useSession';

const route = useRoute();
const router = useRouter();
const { updateBestScore, addToTotalScore } = useSession();
const score = computed(() => parseInt(route.params.score) || 0);
const scoreBreakdown = ref(null);

const lastSong = ref(null);

onMounted(() => {
    const breakdown = localStorage.getItem('karaokeScoreBreakdown');
    if (breakdown) {
        scoreBreakdown.value = JSON.parse(breakdown);
        localStorage.removeItem('karaokeScoreBreakdown');
    }
    
    // Get the last played song from localStorage
    const lastSongData = localStorage.getItem('lastPlayedSong');
    if (lastSongData) {
        lastSong.value = JSON.parse(lastSongData);
    }

    // Update the current session's bestScore and totalScore
    if (score.value > 0) {
        updateBestScore(score.value);
        addToTotalScore(score.value);
        
        // Update challenges completed if available
        if (scoreBreakdown.value && scoreBreakdown.value.challenges) {
            const completedCount = scoreBreakdown.value.challenges.filter(c => c.result === 'completed').length;
            const currentCount = Number(localStorage.getItem("karaoke_session_challenges_completed")) || 0;
            localStorage.setItem("karaoke_session_challenges_completed", String(currentCount + completedCount));
        }
    }
});



function getScoreMessage() {
    if (score.value >= 90) return "Legendary Performance!";
    if (score.value >= 80) return "Excellent Singing!";
    if (score.value >= 70) return "Great Job!";
    if (score.value >= 60) return "Good Effort!";
    if (score.value >= 40) return "Keep Practicing!";
    return "💪 Don't Give Up!";
}


</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.score-page {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
}

.score-container {
    padding: 3rem;
    background: rgba(36, 36, 36, 0.9);
    border-radius: 20px;
    max-width: 500px;
    width: 90%;
}

.score-container h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: white;
    text-shadow: 
        -2px -2px 0 black,
        2px -2px 0 black,
        -2px 2px 0 black,
        2px 2px 0 black;
}

.score-display {
    margin: 2rem 0;
}

.score-number {
    font-size: 4rem;
    font-weight: 900;
    color: #FFD700;
    text-shadow: 
        -3px -3px 0 black,
        3px -3px 0 black,
        -3px 3px 0 black,
        3px 3px 0 black;
    margin-bottom: 1rem;
}

.score-message {
    font-size: 1.5rem;
    font-weight: 400;
    color: white;
    text-shadow: 
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black,
        1px 1px 0 black;
}

.stars {
    font-size: 2rem;
    margin: 2rem 0;
}

.actions {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-top: 3rem;
    justify-content: center;
    flex-wrap: wrap;
}

.action-button {
    padding: 1rem 2rem;
    font-size: 1.1rem;
    font-weight: 500;
    text-decoration: none;
    color: white;
    background: #646cff;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.action-button:hover {
    background: #535bf2;
    transform: translateY(-2px);
}

.action-button.secondary {
    background: #666;
}

.action-button.secondary:hover {
    background: #555;
}

.score-breakdown {
    margin: 2rem 0;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    text-align: left;
}

.score-breakdown h3 {
    text-align: center;
    margin-bottom: 1rem;
    color: #FFD700;
    font-size: 1.3rem;
}

.breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    color: white;
    font-size: 1.1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.breakdown-item:last-child {
    border-bottom: none;
}

.breakdown-item.bonus {
    color: #4caf50;
    font-weight: bold;
}

.breakdown-item.total {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 2px solid rgba(255, 215, 0, 0.5);
    font-size: 1.3rem;
    color: #FFD700;
}

.challenges-summary {
    margin-top: 1.5rem;
}

.challenges-summary h4 {
    color: white;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.challenge-result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
}

.challenge-result.completed {
    border-left: 4px solid #4caf50;
}

.challenge-result.failed {
    border-left: 4px solid #f44336;
}

.challenge-text {
    flex: 1;
    color: white;
    font-size: 0.9rem;
    line-height: 1.3;
}

.challenge-points {
    font-weight: bold;
    font-size: 1rem;
}

.challenge-result.completed .challenge-points {
    color: #4caf50;
}

.challenge-result.failed .challenge-points {
    color: #f44336;
}
</style>