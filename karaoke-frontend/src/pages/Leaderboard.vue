<template>
    <div class="leaderboard">
        <h1>Leaderboard</h1>
        <h2>Longest sessions</h2>

        <button class="home-btn" @click="returnHome">Return to home</button>

        <p v-if="sessions.length === 0" class="empty">
        No sessions yet. Start singing first 🎤
        </p>

        <ol v-else class="list">
        <li v-for="(s, index) in sessions" :key="s.endedAt + '-' + index" class="row">
            <span class="rank">#{{ index + 1 }}</span>
            <span class="user">{{ s.username }}</span>
            <span class="dash">-</span>
            <span class="time">{{ formatMs(s.durationMs) }}</span>
        </li>
        </ol>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const KEY = "karaoke_leaderboard_sessions";

function readSessions() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

const sessions = computed(() => {
    const list = readSessions();

    return list
        .filter((x) => x && typeof x.durationMs === "number")
        .sort((a, b) => b.durationMs - a.durationMs)
        .slice(0, 10);
});

function formatMs(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function returnHome() {
    localStorage.removeItem("karaoke_session_start");
    localStorage.removeItem("karaoke_session_end");
    localStorage.removeItem("karaoke_session_duration_ms");

    localStorage.removeItem("karaoke_uid");
    localStorage.removeItem("karaoke_username");

    router.push("/");

    window.location.reload();
}
</script>

<style scoped>
.leaderboard {
    min-height: 100vh;
    padding: 32px 20px;
    text-align: center;
}

h1 {
    margin-bottom: 6px;
}

h2 {
    margin-top: 0;
    font-weight: 600;
    opacity: 0.8;
}

.home-btn {
    margin-top: 14px;
    padding: 10px 14px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
}

.empty {
    margin-top: 24px;
    opacity: 0.7;
}

.list {
    list-style: none;
    padding: 0;
    max-width: 520px;
    margin: 24px auto 0;
    display: grid;
    gap: 10px;
}

.row {
    display: grid;
    grid-template-columns: 60px 1fr 20px 80px;
    align-items: center;
    background: #f6f6f6;
    border-radius: 12px;
    padding: 12px 14px;
    text-align: left;
}

.rank {
    font-weight: 700;
}

.user {
    font-weight: 600;
}

.dash {
    text-align: center;
    opacity: 0.6;
}

.time {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
}
</style>



