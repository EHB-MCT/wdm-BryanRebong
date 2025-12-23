<template>
    <div class="home">
        <h1>Welcome to KaraoKey!</h1>
        <button @click="startMicrophone">
        Enable Microphone
        </button>

        <p v-if="isActive">Mic pipline is active</p>

        <p v-if="error">Error: {{ error.message }}</p>

        <router-link to="/genres">
        <button>Start Singing</button>
        </router-link>
    </div>
</template>

<script setup>
    import { useMicrophone } from "../composables/useMicrophone.js"
    const { startMicrophone, isActive, error } = useMicrophone()
</script>