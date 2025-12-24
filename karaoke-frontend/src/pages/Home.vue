<template>
    <div class="home">
        <h1>Welcome to KaraoKey!</h1>

        <router-link to="/genres">
        <button>Start Singing</button>
        </router-link>
    </div>
</template>

<script setup>
    import { useMicrophone } from "../composables/useMicrophone.js"
    const { startMicrophone, stopMicrophone, isActive, volume, error } = useMicrophone()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.home {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.home h1 {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 2rem;
}
</style>