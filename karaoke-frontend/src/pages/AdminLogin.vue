<template>
    <div>
        <h1>Admin Login</h1>
        <form @submit.prevent="handleLogin">
            <input
                v-model="password"
                type="password"
                placeholder="Password"
            />
            <button type="submit" :disabled="!password">
                Login
            </button>
        </form>
        <div v-if="showError">
            Incorrect password
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const password = ref('');
const showError = ref(false);
const ADMIN_PASSWORD = 'adminBR1212';

function handleLogin() {
    if (password.value === ADMIN_PASSWORD) {
        localStorage.setItem('karaoke_admin_authed', 'true');
        router.push('/admin');
    } else {
        showError.value = true;
        setTimeout(() => {
            showError.value = false;
        }, 3000);
    }
}
</script>