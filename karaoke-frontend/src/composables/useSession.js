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

    const record = {
        username,
        durationMs,
        endedAt: Date.now(),
    };

    const key = "karaoke_leaderboard_sessions";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push(record);
    localStorage.setItem(key, JSON.stringify(existing));

    return durationMs;
}


    function getDurationMs() {
        const stored = localStorage.getItem("karaoke_session_duration_ms");
        return stored ? Number(stored) : 0;
    }

    function refreshSessionState() {
        syncFromStorage();
    }

    return { isSessionActive, startSession, endSession, getDurationMs, refreshSessionState };
}

