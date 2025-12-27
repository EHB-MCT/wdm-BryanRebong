<template>
    <div class="score-page">
        <div class="score-container">
            <h1>🎤 Performance Complete! 🎤</h1>
            
            <div class="score-display">
                <div class="score-number">{{ score }}/100</div>
                <div class="score-message">{{ getScoreMessage() }}</div>
            </div>
            
            <div class="stars">
                <span v-for="i in 5" :key="i" :class="['star', { filled: i <= getStarRating() }]">
                    ⭐
                </span>
            </div>
            
            <div class="actions">
                <router-link to="/genres" class="action-button">
                    🎵 Choose Another Song
                </router-link>
                <router-link to="/" class="action-button secondary">
                    🏠 Back to Home
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const score = computed(() => parseInt(route.params.score) || 0);

function getScoreMessage() {
    if (score.value >= 90) return "Legendary Performance!";
    if (score.value >= 80) return "Excellent Singing!";
    if (score.value >= 70) return "Great Job!";
    if (score.value >= 60) return "Good Effort!";
    if (score.value >= 40) return "Keep Practicing!";
    return "💪 Don't Give Up!";
}

function getStarRating() {
    if (score.value >= 90) return 5;
    if (score.value >= 80) return 4;
    if (score.value >= 70) return 3;
    if (score.value >= 60) return 2;
    if (score.value >= 40) return 1;
    return 0;
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

.star {
    margin: 0 0.25rem;
    opacity: 0.3;
    transition: opacity 0.3s ease;
}

.star.filled {
    opacity: 1;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 3rem;
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
</style>