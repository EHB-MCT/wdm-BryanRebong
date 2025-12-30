<template>
    <div class="leaderboard">
        <h1>Leaderboard</h1>
        <p>Session duration: <strong>{{ formatted }}</strong></p>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useSession } from "../composables/useSession.js";

const { getDurationMs } = useSession();

function formatMs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const formatted = computed(() => formatMs(getDurationMs()));
</script>

<style scoped>
.leaderboard { min-height: 100vh; display: grid; place-items: center; text-align: center; }
</style>

