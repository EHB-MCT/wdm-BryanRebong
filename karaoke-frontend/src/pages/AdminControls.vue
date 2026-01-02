<template>
    <div>
        <h1>ADMIN CONTROLS</h1>
        <button @click="goToCharts" class="btn-standard">SEE DATA CHARTS</button>
        <br><br>
        <button @click="handleLogout" class="btn-compact">Logout</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
    localStorage.removeItem('karaoke_admin_authed');
    router.push('/');
}

function goToCharts() {
    router.push('/admin/charts');
}
</script>