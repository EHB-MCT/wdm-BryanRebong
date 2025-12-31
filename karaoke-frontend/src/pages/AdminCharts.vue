<template>
    <div>
        <button @click="goBack">← Back</button>
        <button @click="handleLogout">Logout</button>
        <h1>DATA CHARTS</h1>
        
        <h2>Session time by hour of day</h2>
        <div v-if="chartData.length === 0" class="no-data">
            No sessions yet
        </div>
        <div v-else class="chart-container">
            <div class="chart">
                <div 
                    v-for="(data, index) in chartData" 
                    :key="index"
                    class="bar-container"
                >
                    <div 
                        class="bar" 
                        :style="{ height: `${data.percentage}%` }"
                        :title="`${data.hour}:00 - ${data.minutes} minutes`"
                    ></div>
                    <div class="bar-label">{{ data.hour }}</div>
                </div>
            </div>
            <div class="chart-legend">
                <div class="legend-item">
                    <span class="legend-color"></span>
                    <span>Hours (0-23)</span>
                </div>
                <div class="legend-item">
                    <span>Y-axis: Total session minutes per hour</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const chartData = ref([]);

function handleLogout() {
    localStorage.removeItem('karaoke_admin_authed');
    router.push('/admin-login');
}

function goBack() {
    router.push('/admin');
}

function loadChartData() {
    const sessions = JSON.parse(localStorage.getItem('karaoke_leaderboard_sessions') || '[]');
    
    // Initialize 24 hours with 0 minutes
    const hourlyTotals = new Array(24).fill(0);
    
    sessions.forEach(session => {
        if (session.startAt && session.durationMs) {
            const hour = new Date(session.startAt).getHours();
            const minutes = Math.round(session.durationMs / 60000); // Convert to minutes
            if (hour >= 0 && hour < 24 && minutes > 0) {
                hourlyTotals[hour] += minutes;
            }
        }
    });
    
    const maxMinutes = Math.max(...hourlyTotals, 1);
    
    chartData.value = hourlyTotals.map((minutes, hour) => ({
        hour,
        minutes,
        percentage: (minutes / maxMinutes) * 100
    }));
}

onMounted(() => {
    loadChartData();
});
</script>

<style scoped>
.chart-container {
    margin: 20px 0;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.chart {
    display: flex;
    align-items: flex-end;
    height: 200px;
    gap: 8px;
    margin-bottom: 20px;
    padding: 10px;
    background: #f9f9f9;
    border: 1px solid #ddd;
}

.bar-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 20px;
}

.bar {
    width: 100%;
    background: #667eea;
    border-radius: 4px 4px 0 0;
    min-height: 2px;
    transition: all 0.3s ease;
}

.bar:hover {
    background: #5a67d8;
    transform: scaleY(1.05);
}

.bar-label {
    margin-top: 5px;
    font-size: 12px;
    color: #666;
    text-align: center;
}

.chart-legend {
    font-size: 14px;
    color: #666;
}

.legend-item {
    margin: 5px 0;
}

.legend-color {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: #667eea;
    border-radius: 2px;
    margin-right: 5px;
}

.no-data {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 40px;
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
}
</style>