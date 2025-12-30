<template>
  <div class="leaderboard">
    <h1>Leaderboard</h1>

    <p class="summary">
      <strong class="name">{{ displayName }}</strong>
      <span class="sep">•</span>
      Session duration: <strong>{{ formatted }}</strong>
    </p>

  </div>
</template>

<script setup>
import { computed } from "vue";
import { useSession } from "../composables/useSession.js";
import { useUsername } from "../composables/useUsername.js";

const { getDurationMs } = useSession();
const { username } = useUsername();

function formatMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const formatted = computed(() => formatMs(getDurationMs()));
const displayName = computed(() => username.value?.trim() || "Guest");
</script>

<style scoped>
.leaderboard {
  min-height: 100vh;
  display: grid;
  place-items: center;
  text-align: center;
  padding: 24px;
}

.summary {
  font-size: 1.2rem;
  margin-top: 12px;
}

.name {
  font-weight: 700;
}

.sep {
  margin: 0 10px;
  opacity: 0.6;
}
</style>

