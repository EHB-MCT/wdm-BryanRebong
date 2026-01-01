<template>
    <!-- Admin button - always visible -->
    <button
        class="btn-compact admin-btn"
        @click="goToAdmin"
    >
        Admin
    </button>
    
    <!-- End session button - only when session active -->
    <button
        v-if="isSessionActive"
        class="btn-compact end-session-btn"
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

function goToAdmin() {
    router.push("/admin-login");
}
</script>

<style scoped>
.admin-btn {
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 9999;
}

.end-session-btn {
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 9999;
}
</style>


