<template>
        <div class="song-carousel">
            <button class="btn-compact carousel-arrow left" @click="previousSong" :disabled="isTransitioning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
            </button>
            <button class="btn-compact carousel-arrow right" @click="nextSong" :disabled="isTransitioning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
            </button>

            <div class="carousel-container" @keydown="handleKeydown" tabindex="0">
            <div
                v-for="(song, index) in songs"
                :key="song.title"
                class="song-card"
                :style="getCardStyle(index)"
                @click="selectSong(song, index)"
            >
                <div class="card-content">
                <img 
                    :src="song.coverImage" 
                    :alt="`${song.title} by ${song.artist}`"
                    class="cover-image"
                    @error="handleImageError"
                />
                <div class="song-info">
                    <h3 class="song-title">{{ song.title }}</h3>
                    <p class="song-artist">by {{ song.artist }}</p>
                </div>
                </div>
            </div>
            </div>
        </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    songs: {
        type: Array,
        required: true
    }
})

const router = useRouter()
const activeIndex = ref(0)
const isTransitioning = ref(false)

const SPACING = 225
const BASE_SCALE = 1.0
const SCALE_FACTOR = 0.12
const BASE_OPACITY = 1.0
const OPACITY_FACTOR = 0.2

const getCardStyle = (index) => {
    const totalSongs = props.songs.length
    if (totalSongs === 0) return {}
    
    let distance = index - activeIndex.value
    
    if (distance > totalSongs / 2) {
        distance -= totalSongs
    } else if (distance < -totalSongs / 2) {
        distance += totalSongs
    }
    
    const translateX = distance * SPACING
    const scale = Math.max(0.3, BASE_SCALE - Math.abs(distance) * SCALE_FACTOR)
    const opacity = Math.max(0.1, BASE_OPACITY - Math.abs(distance) * OPACITY_FACTOR)
    const zIndex = totalSongs - Math.abs(distance)
    
    return {
        transform: `translateX(${translateX}px) translateZ(${Math.abs(distance) * -50}px) scale(${scale})`,
        opacity,
        zIndex,
        transition: isTransitioning.value ? 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'all 0.2s ease-out',
        pointerEvents: Math.abs(distance) > 2 ? 'none' : 'auto'
    }
}

const nextSong = () => {
    if (isTransitioning.value || props.songs.length === 0) return
    
    isTransitioning.value = true
    activeIndex.value = (activeIndex.value + 1) % props.songs.length
    
    setTimeout(() => {
        isTransitioning.value = false
    }, 400)
}

const previousSong = () => {
    if (isTransitioning.value || props.songs.length === 0) return
    
    isTransitioning.value = true
    activeIndex.value = activeIndex.value - 1
    
    if (activeIndex.value < 0) {
        activeIndex.value = props.songs.length - 1
    }
    
    setTimeout(() => {
        isTransitioning.value = false
    }, 400)
}

const selectSong = (song, index) => {
    if (index === activeIndex.value) {
        const genre = router.currentRoute.value.params.genre
        const encodedTitle = encodeURIComponent(song.title)
        router.push(`/now-playing/${genre}/${encodedTitle}`)
    } else {
        const distance = index - activeIndex.value
        
        if (distance > props.songs.length / 2) {
        for (let i = 0; i < props.songs.length - distance; i++) {
            previousSong()
        }
        } else if (distance < -props.songs.length / 2) {
        for (let i = 0; i < props.songs.length + distance; i++) {
            nextSong()
        }
        } else if (distance > 0) {
        for (let i = 0; i < distance; i++) {
            nextSong()
        }
        } else {
        for (let i = 0; i < Math.abs(distance); i++) {
            previousSong()
        }
        }
    }
}

const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
        previousSong()
    } else if (event.key === 'ArrowRight') {
        nextSong()
    }
}

const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}
</script>

<style scoped>
.song-carousel {
    position: relative;
    width: 100%;
    flex: 1;
    max-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    perspective: 1200px;
}

.carousel-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    transform-style: preserve-3d;
}

.song-card {
    position: absolute;
    width: 480px;
    height: 675px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transform-style: preserve-3d;
}

.card-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.3s ease;
}

.cover-image {
    width: 100%;
    height: 480px;
    object-fit: cover;
    border-radius: 30px;
    margin-bottom: 30px;
    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
}

.song-card:hover .cover-image {
    transform: scale(1.03);
    box-shadow: 0 30px 75px rgba(0, 0, 0, 0.5);
}

.song-info {
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    padding: 0 15px;
}

.song-title {
    font-size: 2.1rem;
    font-weight: bold;
    margin: 0 0 12px 0;
    color: white;
    line-height: 1.2;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.song-artist {
    font-size: 1.5rem;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.carousel-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 0;
}

.carousel-arrow:hover:not(:disabled) {
    transform: translateY(-50%) scale(1.1);
}

.carousel-arrow:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: translateY(-50%) scale(0.9);
}

.carousel-arrow.left {
    left: 30px;
}

.carousel-arrow.right {
    right: 30px;
    }

.carousel-arrow svg {
    color: white;
    width: 28px;
    height: 28px;
}
</style>