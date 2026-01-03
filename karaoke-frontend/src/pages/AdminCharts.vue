<template>
    <div>
<button @click="goBack" class="btn-compact">← Back</button>
        <button @click="handleLogout" class="btn-compact">Logout</button>
        <h1>DATA CHARTS</h1>
        
<div class="charts-wrapper">
            <section class="chart-card">
                <h2>Most Played Songs</h2>
                <div class="chart-quarter">
                    <div v-if="mostPlayedSongsChartData" class="chart-container-large">
                        <Bar :data="mostPlayedSongsChartData" :options="chartOptions" />
                    </div>
                    <div v-else class="no-data">
                        No song play data yet. Play a song first 🎤
                    </div>
                </div>
            </section>
            
            <section class="chart-card">
                <h2>Most Played Genres</h2>
                <div class="chart-quarter">
                    <div v-if="mostPlayedGenresChartData" class="chart-container-large">
                        <Bar :data="mostPlayedGenresChartData" :options="genreChartOptions" />
                    </div>
                    <div v-else class="no-data">
                        No genre data yet. Pick a genre first 🎶
                    </div>
                </div>
            </section>
            
            <section class="chart-card">
                <h2>Total Session Minutes by Hour</h2>
                <div class="chart-quarter">
                    <div v-if="sessionMinutesChartData" class="chart-container-large">
                        <Bar :data="sessionMinutesChartData" :options="sessionChartOptions" />
                    </div>
                    <div v-else class="no-data">
                        No session data yet. End a session first 🎤
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { getSongPlays, getGenrePlays } from '../utils/trackAnalytics.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const router = useRouter();
const mostPlayedSongsData = ref(null);
const mostPlayedGenresData = ref(null);
const sessionMinutesData = ref(null);

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

const mostPlayedGenresChartData = computed(() => {
    if (!mostPlayedGenresData.value || Object.keys(mostPlayedGenresData.value).length === 0) {
        return null;
    }

    const genres = ['pop', 'rnb', 'hiphop', 'kpop'];
    const labels = genres.map(genre => genre.charAt(0).toUpperCase() + genre.slice(1));
    const data = genres.map(genre => mostPlayedGenresData.value[genre] || 0);

    return {
        labels,
        datasets: [
            {
                label: 'Plays',
                data,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(75, 192, 192, 1)'
            }
        ]
    };
});

const genreChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Most Played Genres',
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
                color: 'white'
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

const sessionMinutesChartData = computed(() => {
    if (!sessionMinutesData.value || sessionMinutesData.value.length === 0) {
        return null;
    }

    const labels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const data = sessionMinutesData.value;

    return {
        labels,
        datasets: [
            {
                label: 'Minutes',
                data,
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(255, 159, 64, 1)'
            }
        ]
    };
});

const sessionChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        },
        title: {
            display: true,
            text: 'Total Session Minutes by Hour',
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
                color: 'white'
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
                text: 'Minutes',
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

function loadMostPlayedGenresData() {
    mostPlayedGenresData.value = getGenrePlays();
}

function loadSessionMinutesData() {
    const sessions = JSON.parse(localStorage.getItem('karaoke_leaderboard_sessions') || '[]');
    
    const hourMinutes = new Array(24).fill(0);
    
    sessions.forEach(session => {
        if (session.endedAt && session.durationMs) {
            const hour = new Date(session.endedAt).getHours();
            const minutes = Math.round(session.durationMs / 60000);
            
            if (hour >= 0 && hour < 24 && minutes > 0) {
                hourMinutes[hour] += minutes;
            }
        }
    });
    
    sessionMinutesData.value = hourMinutes;
}

onMounted(() => {
    loadMostPlayedSongsData();
    loadMostPlayedGenresData();
    loadSessionMinutesData();
});
</script>

<style scoped>
.charts-wrapper {
    display: flex;
    flex-direction: column;
    gap: 56px;
    max-width: 100%;
    margin: 0 auto;
}

.chart-card {
    padding: 20px;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(0, 0, 0, 0.12);
    backdrop-filter: blur(10px);
}

.chart-card h2 {
    margin: 0 0 18px 0;
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
}

.chart-quarter {
    margin: 0;
    padding: 0;
    border: none;
    border-radius: 8px;
    height: 300px;
    position: relative;
}

.chart-container-large {
    height: 100%;
    position: relative;
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
  gap: 6px;
  padding: 5px;
  background: rgba(249, 249, 249, 0.06);
  border: none;
  border-radius: 12px;
  box-sizing: border-box;
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