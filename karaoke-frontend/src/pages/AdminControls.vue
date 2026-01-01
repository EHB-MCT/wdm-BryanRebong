<template>
    <div>
        <h1>ADMIN CONTROLS</h1>
        <button @click="handleLogout" class="btn-compact">Logout</button>
        <br><br>
        <button @click="goToCharts" class="btn-standard">SEE DATA CHARTS</button>
        <button @click="goToSongs" class="btn-standard">EDIT SONGS</button>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
    localStorage.removeItem('karaoke_admin_authed');
    router.push('/admin-login');
}

function goToCharts() {
    router.push('/admin/charts');
}

function goToSongs() {
    router.push('/admin/songs');
}
</script>