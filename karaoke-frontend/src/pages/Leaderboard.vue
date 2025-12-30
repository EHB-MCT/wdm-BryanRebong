<template>
    <div class="leaderboard">
        <h1>Leaderboard</h1>
        <div class="session-info">
            <span class="username">{{ username }}</span>
            <span class="duration">{{ formatted }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useSession } from "../composables/useSession.js";

const { getDurationMs } = useSession();
const username = ref('');

function formatMs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const formatted = computed(() => formatMs(getDurationMs()));

onMounted(() => {
    const storedUsername = localStorage.getItem('karaoke_username');
    if (storedUsername) {
        username.value = storedUsername;
    }
});
</script>

<style scoped>
.leaderboard { 
    min-height: 100vh; 
    display: grid; 
    place-items: center; 
    text-align: center; 
}

.session-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.2rem;
    margin-top: 1rem;
}

.username {
    font-weight: 600;
    color: #2563eb;
}

.duration {
    font-weight: 500;
    color: #64748b;
}
</style>

