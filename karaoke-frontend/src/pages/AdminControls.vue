<template>
    <div>
        <h1>ADMIN CONTROLS</h1>
        <button @click="handleLogout">Logout</button>
        <br><br>
        <button @click="goToCharts">SEE DATA CHARTS</button>
        <button @click="goToSongs">EDIT SONGS</button>
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