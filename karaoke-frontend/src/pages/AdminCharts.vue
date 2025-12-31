<template>
    <div class="admin-charts">
        <div class="charts-header">
            <button @click="goBack" class="back-btn">← Back</button>
            <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
        
        <div class="charts-content">
            <h1>DATA CHARTS</h1>
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

function goBack() {
    router.push('/admin');
}
</script>

<style scoped>
.admin-charts {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 0;
}

.charts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
}

.back-btn, .logout-btn {
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn:hover, .logout-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
}

.charts-content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.charts-content h1 {
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-align: center;
}

@media (max-width: 768px) {
    .charts-header {
        padding: 1rem;
    }
    
    .charts-content h1 {
        font-size: 2rem;
    }
}
</style>