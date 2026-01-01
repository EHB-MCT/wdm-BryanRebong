<template>
    <div>
        <button @click="goBack" class="btn-compact">← Back</button>
        <button @click="handleLogout" class="btn-compact">Logout</button>
        <h1>EDIT SONGS</h1>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
    localStorage.removeItem('karaoke_admin_authed');
    router.push('/admin-login');
}

function goBack() {
    router.push('/admin');
}
</script>