<template>
    <!-- Admin button - always visible -->
    <button
        class="admin-btn"
        @click="goToAdmin"
    >
        Admin
    </button>
    
    <!-- End session button - only when session active -->
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

function goToAdmin() {
    router.push("/admin-login");
}
</script>

<style scoped>
.admin-btn {
    position: fixed;
    right: 20px;
    bottom: 70px;
    padding: 10px 14px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    z-index: 9999;
    background: #ff6b6b;
    color: white;
    font-weight: 600;
}

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


