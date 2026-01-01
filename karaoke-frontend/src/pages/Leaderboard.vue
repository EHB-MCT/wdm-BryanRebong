<template>
    <div class="leaderboard">
        <h1>Leaderboard</h1>
        
        <button class="btn-standard" @click="returnHome">Return to home</button>

        <div class="leaderboards-container">
            <div class="leaderboard-section">
                <h2>Longest sessions</h2>
                
                <p v-if="sessions.length === 0" class="empty">
                No sessions yet. Start singing first
                </p>

                <ol v-else class="list">
                <li v-for="(s, index) in sessions" :key="'duration-' + s.endedAt + '-' + index" class="row">
                    <span class="rank">#{{ index + 1 }}</span>
                    <span class="user">{{ s.username }}</span>
                    <span class="dash">-</span>
                    <span class="time">{{ formatMs(s.durationMs) }}</span>
                </li>
                </ol>
            </div>

            <div class="leaderboard-section">
                <h2>Highest total score</h2>
                
                <p v-if="totalScoreSessions.length === 0" class="empty">
                No scored sessions yet. Complete some songs! 🎵
                </p>

                <ol v-else class="list">
                <li v-for="(s, index) in totalScoreSessions" :key="'total-score-' + s.endedAt + '-' + index" class="row">
                    <span class="rank">#{{ index + 1 }}</span>
                    <span class="user">{{ s.username }}</span>
                    <span class="dash">-</span>
                    <span class="score">{{ s.totalScore }}</span>
                </li>
                </ol>
            </div>

            <div class="leaderboard-section">
                <h2>Most challenges completed</h2>
                
                <p v-if="mostChallengesSessions.length === 0" class="empty">
                No challenges completed yet. Accept some challenges!
                </p>

                <ol v-else class="list">
                <li v-for="(s, index) in mostChallengesSessions" :key="'challenges-' + s.endedAt + '-' + index" class="row">
                    <span class="rank">#{{ index + 1 }}</span>
                    <span class="user">{{ s.username }}</span>
                    <span class="dash">-</span>
                    <span class="challenges">{{ s.challengesCompleted }}</span>
                </li>
                </ol>
            </div>
        </div>
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

const totalScoreSessions = computed(() => {
    const list = readSessions();

    return list
        .filter((x) => x && typeof x.totalScore === "number" && x.totalScore > 0)
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);
});

const mostChallengesSessions = computed(() => {
    const list = readSessions();

    return list
        .filter((x) => x && typeof x.challengesCompleted === "number" && x.challengesCompleted > 0)
        .sort((a, b) => b.challengesCompleted - a.challengesCompleted)
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

    router.replace("/");
}

</script>

<style scoped>
.leaderboard {
    min-height: 100vh;
    padding: 32px 20px;
    text-align: center;
    color: white;
    background: transparent;
}

h1 {
    margin-bottom: 24px;
    font-size: 3rem;
    font-weight: 900;
    text-shadow: 
        -2px -2px 0 rgba(0, 0, 0, 0.8),
        2px -2px 0 rgba(0, 0, 0, 0.8),
        -2px 2px 0 rgba(0, 0, 0, 0.8),
        2px 2px 0 rgba(0, 0, 0, 0.8);
}

h2 {
    margin-top: 0;
    font-weight: 600;
    opacity: 0.9;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Home button now uses .btn-standard from global styles */

.leaderboards-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    max-width: 1400px;
    margin: 0 auto;
    justify-items: center;
}

@media (min-width: 768px) {
    .leaderboards-container {
        grid-template-columns: 1fr 1fr;
    }
}

@media (min-width: 1024px) {
    .leaderboards-container {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

.leaderboard-section {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
}

.empty {
    margin-top: 24px;
    opacity: 0.7;
}

.list {
    list-style: none;
    padding: 0;
    margin: 24px 0 0;
    display: grid;
    gap: 10px;
}

.row {
    display: grid;
    grid-template-columns: 60px 1fr 20px 80px;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px 14px;
    text-align: left;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.row:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: scale(1.02);
}

.rank {
    font-weight: 700;
    color: #ffd700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.user {
    font-weight: 600;
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.dash {
    text-align: center;
    opacity: 0.8;
    color: white;
}

.time, .score, .challenges {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: #ffd700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.empty {
    margin-top: 24px;
    opacity: 0.8;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
</style>



