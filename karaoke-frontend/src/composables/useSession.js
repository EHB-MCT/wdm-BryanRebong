import { ref } from "vue";

const isSessionActive = ref(false);

const start = localStorage.getItem("karaoke_session_start");
const end = localStorage.getItem("karaoke_session_end");
isSessionActive.value = !!start && !end;

export function useSession() {
    function startSession() {
        const now = Date.now();
        localStorage.setItem("karaoke_session_start", String(now));
        localStorage.removeItem("karaoke_session_end");
        localStorage.removeItem("karaoke_session_duration_ms");
        isSessionActive.value = true;
  }

    function endSession() {
        const startMs = Number(localStorage.getItem("karaoke_session_start"));
        const endMs = Date.now();
        const durationMs = (Number.isFinite(startMs) ? endMs - startMs : 0);

        localStorage.setItem("karaoke_session_end", String(endMs));
        localStorage.setItem("karaoke_session_duration_ms", String(durationMs));
        isSessionActive.value = false;

        return durationMs;
    }

    function getDurationMs() {
        const stored = localStorage.getItem("karaoke_session_duration_ms");
        return stored ? Number(stored) : 0;
    }

    return { isSessionActive, startSession, endSession, getDurationMs };
}

