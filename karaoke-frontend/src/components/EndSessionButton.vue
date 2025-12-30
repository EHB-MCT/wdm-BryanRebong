<template>
    <button v-if="isSessionActive" class="end-session-btn" @click="onEnd">
        End session
    </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useSession } from "../composables/useSession.js";
import { useUsername } from "../composables/useUsername.js";

const router = useRouter();
const { endSession } = useSession();
const { clearUsername } = useUsername();

function onEnd() {
    endSession()
    clearUsername();
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

