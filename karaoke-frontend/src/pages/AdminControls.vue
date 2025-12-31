<template>
    <div class="admin-controls">
        <div class="admin-header">
            <h1>ADMIN CONTROLS</h1>
            <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
        
        <div class="admin-buttons">
            <button @click="goToCharts" class="admin-button">
                SEE DATA CHARTS
            </button>
            <button @click="goToSongs" class="admin-button">
                EDIT SONGS
            </button>
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

function goToCharts() {
    router.push('/admin/charts');
}

function goToSongs() {
    router.push('/admin/songs');
}
</script>

<style scoped>
.admin-controls {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 0;
}

.admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.admin-header h1 {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
}

.logout-btn {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
}

.admin-buttons {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
}

.admin-button {
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 20px;
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 1.4;
}

.admin-button:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    background: white;
}

@media (max-width: 768px) {
    .admin-header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    }
    
    .admin-header h1 {
        font-size: 1.2rem;
    }
    
    .admin-buttons {
        flex-direction: column;
        gap: 1.5rem;
        height: calc(100vh - 120px);
        padding: 1rem;
    }
    
    .admin-button {
        width: 150px;
        height: 150px;
        font-size: 1rem;
    }
}
</style>