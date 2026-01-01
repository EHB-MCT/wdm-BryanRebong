<template>
    <div>
        <button @click="goBack">← Back</button>
        <button @click="handleLogout">Logout</button>
        <h1>DATA CHARTS</h1>
        
        <h2>Total session time by time of day</h2>
        <div class="chart-quarter">
            <div v-if="chartData.length === 0" class="no-data">
                No sessions yet
            </div>
            <div v-else class="chart-container-small">
                <div class="chart-info-small">
                    <div class="total-minutes-small">Total: {{ totalMinutes }} min</div>
                </div>
                <div class="chart-small">
                    <div 
                        v-for="(data, index) in chartData" 
                        :key="index"
                        class="bar-container-small"
                    >
                        <div 
                            class="bar-small" 
                            :style="{ height: `${data.percentage}%` }"
                            :title="`${data.periodStart}:00-${data.periodEnd}:00: ${data.minutes} min`"
                        ></div>
                        <div class="bar-label-small">{{ data.periodStart }}</div>
                    </div>
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
const totalMinutes = ref(0);

function handleLogout() {
    localStorage.removeItem('karaoke_admin_authed');
    router.push('/admin-login');
}

function goBack() {
    router.push('/admin');
}

function loadChartData() {
    const sessions = JSON.parse(localStorage.getItem('karaoke_leaderboard_sessions') || '[]');
    
    // Initialize 48 half-hour periods (0:00-0:30, 0:30-1:00, ..., 23:30-24:00)
    const periodTotals = new Array(48).fill(0);
    
    sessions.forEach(session => {
        if (session.startAt && session.durationMs) {
            const date = new Date(session.startAt);
            const minutes = Math.round(session.durationMs / 60000); // Convert to minutes
            if (minutes > 0) {
                const hour = date.getHours();
                const minute = date.getMinutes();
                const periodIndex = hour * 2 + (minute >= 30 ? 1 : 0);
                
                if (periodIndex >= 0 && periodIndex < 48) {
                    periodTotals[periodIndex] += minutes;
                }
            }
        }
    });
    
    // Show all 48 periods (including empty ones)
    const maxMinutes = Math.max(...periodTotals, 1);
    const allData = [];
    
    for (let i = 0; i < 48; i++) {
        const periodStart = Math.floor(i / 2);
        const periodEnd = i % 2 === 0 ? periodStart : periodStart + 1;
        
        allData.push({
            periodStart,
            periodEnd,
            minutes: periodTotals[i],
            percentage: (periodTotals[i] / maxMinutes) * 100
        });
    }
    
    totalMinutes.value = periodTotals.reduce((sum, minutes) => sum + minutes, 0);
    chartData.value = allData;
}

onMounted(() => {
    loadChartData();
});
</script>

<style scoped>
.chart-quarter {
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 8px;
    height: 150px;
}

.chart-container-small {
    height: 120px;
}

.chart-info-small {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-size: 12px;
    color: #666;
}

.total-minutes-small {
    font-weight: bold;
}

.chart-small {
    display: flex;
    align-items: flex-end;
    height: 80px;
    gap: 2px;
    padding: 5px;
    background: rgba(249, 249, 249, 0.1);
    border: 1px solid rgba(221, 221, 221, 0.3);
}

.bar-container-small {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    min-width: 3px;
}

.bar-small {
    width: 100%;
    background: #667eea;
    border-radius: 2px 2px 0 0;
    min-height: 1px;
    transition: all 0.3s ease;
}

.bar-small:hover {
    background: #5a67d8;
    transform: scaleY(1.1);
}

.bar-label-small {
    margin-top: 2px;
    font-size: 8px;
    color: #666;
    text-align: center;
}

.no-data {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 20px;
    background: rgba(249, 249, 249, 0.1);
    border: 1px solid rgba(221, 221, 221, 0.3);
    border-radius: 8px;
    font-size: 12px;
}
</style>