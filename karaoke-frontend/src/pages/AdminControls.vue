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
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.admin-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 3rem;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.admin-container h1 {
    color: #333;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    margin-top: 0;
}

.admin-content {
    text-align: left;
    margin: 2rem 0;
}

.admin-description {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.future-features {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 15px;
    padding: 2rem;
    margin: 2rem 0;
}

.future-features h3 {
    color: #667eea;
    font-size: 1.3rem;
    margin-top: 0;
    margin-bottom: 1rem;
    text-align: center;
}

.future-features ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.future-features li {
    padding: 0.8rem 0;
    border-bottom: 1px solid rgba(102, 126, 234, 0.2);
    font-size: 1rem;
    color: #555;
}

.future-features li:last-child {
    border-bottom: none;
}

.future-features strong {
    color: #333;
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

.back-btn {
    display: inline-block;
    padding: 12px 24px;
    background: #6c757d;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: #5a6268;
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .admin-container {
        padding: 2rem;
        margin: 1rem;
    }
    
    .admin-container h1 {
        font-size: 2rem;
    }
    
    .future-features {
        padding: 1.5rem;
    }
}
</style>