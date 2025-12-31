<template>
    <div class="admin-login">
        <div class="login-container">
            <h1>Admin Login</h1>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Password"
                        class="password-input"
                        :class="{ error: showError }"
                    />
                </div>
                <button type="submit" class="login-btn" :disabled="!password">
                    Login
                </button>
            </form>
            <div v-if="showError" class="error-message">
                Incorrect password
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const password = ref('');
const showError = ref(false);
const ADMIN_PASSWORD = 'admin123';

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
.admin-login {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 3rem;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.login-container h1 {
    color: #333;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    margin-top: 0;
}

.form-group {
    margin-bottom: 1.5rem;
}

.password-input {
    width: 100%;
    padding: 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-sizing: border-box;
}

.password-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-input.error {
    border-color: #ff6b6b;
}

.login-btn {
    width: 100%;
    padding: 15px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
    background: #5a67d8;
    transform: translateY(-2px);
}

.login-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.error-message {
    margin-top: 1rem;
    padding: 10px;
    background: rgba(255, 107, 107, 0.1);
    color: #ff6b6b;
    border-radius: 8px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .login-container {
        padding: 2rem;
        margin: 1rem;
    }
    
    .login-container h1 {
        font-size: 2rem;
    }
}
</style>