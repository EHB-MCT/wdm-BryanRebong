<template>
    <div>
        <h1>Admin Login</h1>
        <form @submit.prevent="handleLogin" class="login-form">
            <input
                v-model="password"
                type="password"
                placeholder="Password"
                class="password-input"
            />
            <button type="submit" :disabled="!password" class="btn-compact">
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
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

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

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap');

.login-form {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
}

.password-input {
    padding: 1rem 2rem;
    font-size: 1.2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    color: white;
    font-weight: bold;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    width: 200px;
    outline: none;
}

.password-input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.password-input:focus {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
}

.password-input:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
}

div {
    font-family: 'Lato', system-ui, Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    color: white;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
}

h1 {
    color: white;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 
        -2px -2px 0 rgba(0, 0, 0, 0.8),
        2px -2px 0 rgba(0, 0, 0, 0.8),
        -2px 2px 0 rgba(0, 0, 0, 0.8),
        2px 2px 0 rgba(0, 0, 0, 0.8);
}

div[v-if="showError"] {
    color: #ff6b6b;
    margin-top: 1rem;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}
</style>