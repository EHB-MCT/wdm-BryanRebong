<template>
    <button
        v-if="isSessionActive"
        class="end-session-btn"
        @click="handleEndSession"
    >
        End session
    </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useSession } from "../composables/useSession.js";

const router = useRouter();
const { isSessionActive, endSession } = useSession();

function handleEndSession() {
    endSession();
    router.push("/leaderboard");
}
</script>

<style scoped>
.end-session-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    padding: 10px 14px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    z-index: 9999;
}
</style>
