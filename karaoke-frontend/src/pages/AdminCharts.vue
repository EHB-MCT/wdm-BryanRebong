<template>
    <div>
<button @click="goBack" class="btn-compact">← Back</button>
        <button @click="handleLogout" class="btn-compact">Logout</button>
        <h1>DATA CHARTS</h1>
        
<h2>Most Played Songs</h2>
        <div class="chart-quarter">
            <div v-if="mostPlayedSongsChartData" class="chart-container-large">
                <Bar :data="mostPlayedSongsChartData" :options="chartOptions" />
            </div>
            <div v-else class="no-data">
                No song play data yet. Play a song first 🎤
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { getSongPlays } from '../utils/trackAnalytics.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const router = useRouter();
const mostPlayedSongsData = ref(null);

const mostPlayedSongsChartData = computed(() => {
    if (!mostPlayedSongsData.value || mostPlayedSongsData.value.length === 0) {
        return null;
    }

    const sortedSongs = Object.entries(mostPlayedSongsData.value)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const labels = sortedSongs.map(([song]) => {
        if (song.length > 30) {
            return song.substring(0, 27) + '...';
        }
        return song;
    });

    const data = sortedSongs.map(([, plays]) => plays);

    return {
        labels,
        datasets: [
            {
                label: 'Plays',
                data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(102, 126, 234, 1)'
            }
        ]
    };
});

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Most Played Songs',
            color: 'white',
            font: {
                size: 16,
                weight: 'bold'
            }
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white'
        }
    },
    scales: {
        x: {
            ticks: {
                color: 'white',
                maxRotation: 45,
                minRotation: 0
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            }
        },
        y: {
            beginAtZero: true,
            ticks: {
                color: 'white',
                stepSize: 1
            },
            grid: {
                color: 'rgba(255, 255, 255, 0.1)'
            },
            title: {
                display: true,
                text: 'Plays',
                color: 'white'
            }
        }
    }
}));

function handleLogout() {
    localStorage.removeItem('karaoke_admin_authed');
    router.push('/');
}

function goBack() {
    router.push('/admin');
}



function loadMostPlayedSongsData() {
    mostPlayedSongsData.value = getSongPlays();
}

onMounted(() => {
    loadMostPlayedSongsData();
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



.chart-container-large {
    height: 300px;
    position: relative;
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