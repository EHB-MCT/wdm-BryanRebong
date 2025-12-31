<template>
    <div class="admin-controls">
        <div class="admin-container">
            <h1>Admin Controls</h1>
            <div class="admin-actions">
                <button @click="handleLogout" class="logout-btn">
                    Logout
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleLogout() {
    localStorage.removeItem('karaoke_admin_authed');
    router.push('/admin-login');
}
</script>

<style scoped>
.admin-controls {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 0;
    overflow: hidden;
}

.admin-container {
    background: rgba(255, 255, 255, 0.95);
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.admin-container h1 {
    color: #333;
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 2rem;
    margin-top: 0;
}

.admin-actions {
    margin-top: 2rem;
    text-align: center;
}

.logout-btn {
    display: inline-block;
    padding: 12px 24px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: #c82333;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .admin-container {
        width: 95%;
        padding: 1.5rem;
    }
    
    .admin-container h1 {
        font-size: 1.8rem;
    }
}
</style>