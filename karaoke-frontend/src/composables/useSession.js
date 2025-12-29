import { ref } from "vue";

const isSessionActive = ref(false);

function loadSessionState() {
  const start = localStorage.getItem("karaoke_session_start");
  const end = localStorage.getItem("karaoke_session_end");
  isSessionActive.value = !!start && !end;
}
loadSessionState();

export function useSession() {
  function startSession() {
    const now = Date.now();
    localStorage.setItem("karaoke_session_start", String(now));
    localStorage.removeItem("karaoke_session_end");
    localStorage.removeItem("karaoke_session_duration_ms");
    isSessionActive.value = true;
  }

  function endSession() {
    const start = Number(localStorage.getItem("karaoke_session_start"));
    const end = Date.now();

    if (!start || Number.isNaN(start)) {
      // fallback if something went wrong
      localStorage.setItem("karaoke_session_start", String(end));
    }

    const durationMs = end - start;

    localStorage.setItem("karaoke_session_end", String(end));
    localStorage.setItem("karaoke_session_duration_ms", String(durationMs));
    isSessionActive.value = false;

    return durationMs;
  }

  function getDurationMs() {
    const stored = localStorage.getItem("karaoke_session_duration_ms");
    return stored ? Number(stored) : 0;
  }

  return {
    isSessionActive,
    startSession,
    endSession,
    getDurationMs,
  };
}
