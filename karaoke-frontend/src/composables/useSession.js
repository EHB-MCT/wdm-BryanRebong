import { ref } from "vue";

const isSessionActive = ref(false);

function syncFromStorage() {
    const start = localStorage.getItem("karaoke_session_start");
    const end = localStorage.getItem("karaoke_session_end");
    isSessionActive.value = !!start && !end;
}

syncFromStorage();

export function useSession() {
    function startSession() {
        const now = Date.now();
        localStorage.setItem("karaoke_session_start", String(now));
        localStorage.removeItem("karaoke_session_end");
        localStorage.removeItem("karaoke_session_duration_ms");
        localStorage.setItem("karaoke_session_total_score", "0");
        syncFromStorage();
    }

function endSession() {
    const startMs = Number(localStorage.getItem("karaoke_session_start"));
    const endMs = Date.now();

    const durationMs = Number.isFinite(startMs) ? Math.max(0, endMs - startMs) : 0;

    localStorage.setItem("karaoke_session_end", String(endMs));
    localStorage.setItem("karaoke_session_duration_ms", String(durationMs));
    syncFromStorage();

    const username = localStorage.getItem("karaoke_username") || "Guest";
    const bestScore = Number(localStorage.getItem("karaoke_session_best_score")) || null;
    const totalScore = Number(localStorage.getItem("karaoke_session_total_score")) || 0;
    const challengesCompleted = getCompletedChallengesCount();

const record = {
    sessionId: crypto.randomUUID(),
    username,
    durationMs,
    startAt: startMs,
    endedAt: Date.now(),
    bestScore,
    totalScore,
    challengesCompleted,
};



    const key = "karaoke_leaderboard_sessions";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(record);
    localStorage.setItem(key, JSON.stringify(existing));

    localStorage.removeItem("karaoke_session_best_score");
    localStorage.removeItem("karaoke_session_total_score");
    localStorage.removeItem("karaoke_session_challenges_completed");
    localStorage.removeItem("karaoke_session_completed_challenges");

    return durationMs;
}


    function getDurationMs() {
        const stored = localStorage.getItem("karaoke_session_duration_ms");
        return stored ? Number(stored) : 0;
    }

function updateBestScore(score) {
        if (isSessionActive.value) {
            const currentBest = Number(localStorage.getItem("karaoke_session_best_score")) || 0;
            if (score > currentBest) {
                localStorage.setItem("karaoke_session_best_score", String(score));
            }
        }
    }

    function addCompletedChallenge(challengeId) {
        if (!isSessionActive.value || !challengeId) return false;
        
        const key = "karaoke_session_completed_challenges";
        const completedChallenges = JSON.parse(localStorage.getItem(key) || "[]");
        
        if (!completedChallenges.includes(challengeId)) {
            completedChallenges.push(challengeId);
            localStorage.setItem(key, JSON.stringify(completedChallenges));
            return true;
        }
        return false;
    }

    function addToTotalScore(score) {
        if (!isSessionActive.value || typeof score !== "number" || score <= 0) return;
        
        const currentTotal = Number(localStorage.getItem("karaoke_session_total_score")) || 0;
        const newTotal = currentTotal + score;
        localStorage.setItem("karaoke_session_total_score", String(newTotal));
    }

    function getCompletedChallengesCount() {
        const key = "karaoke_session_completed_challenges";
        const completedChallenges = JSON.parse(localStorage.getItem(key) || "[]");
        return completedChallenges.length;
    }

    function refreshSessionState() {
        syncFromStorage();
    }

    return { isSessionActive, startSession, endSession, getDurationMs, updateBestScore, addCompletedChallenge, addToTotalScore, refreshSessionState };
}

