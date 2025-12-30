<template>
    <div>
        <div v-if="isActive" class="volume-display">
        Volume: {{ (volume * 0.1).toFixed(1) }} dB
        </div>

        <div v-if="username && isSessionActive" class="username-display">
        {{ username }}
        </div>

        <router-view></router-view>

        <EndSessionButton />
    </div>
</template>

<script setup>
import { useUsername } from "./composables/useUsername.js";
import { useMicrophone } from "./composables/useMicrophone.js";
import { useSession } from "./composables/useSession.js";
import EndSessionButton from "./components/EndSessionButton.vue";

const { username } = useUsername();
const { isActive, volume } = useMicrophone();
const { isSessionActive } = useSession();
</script>

<style>
.volume-display {
    position: fixed;
    top: 20px;
    left: 20px;
    background: #e8f5e8;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    z-index: 100;
}

.username-display {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #f0f0f0;
    padding: 8px 16px;
    border-radius: 20px;
    font-weight: 500;
    z-index: 100;
}
</style>


