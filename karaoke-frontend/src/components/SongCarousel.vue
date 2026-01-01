<template>
  <div class="song-carousel">
    <!-- Arrow controls -->
    <button class="carousel-arrow left" @click="previousSong" :disabled="isTransitioning">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
    </button>
    <button class="carousel-arrow right" @click="nextSong" :disabled="isTransitioning">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>

    <!-- Carousel container -->
    <div class="carousel-container" @keydown="handleKeydown" tabindex="0">
      <!-- Render ALL songs at once in cover flow -->
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
const activeIndex = ref(0) // Start with first song in center
const isTransitioning = ref(false)

// Cover flow configuration
const SPACING = 120 // pixels between cards
const BASE_SCALE = 1.0
const SCALE_FACTOR = 0.15 // scale reduction per card distance
const BASE_OPACITY = 1.0
const OPACITY_FACTOR = 0.25 // opacity reduction per card distance

// Calculate card style based on distance from center
const getCardStyle = (index) => {
  const totalSongs = props.songs.length
  if (totalSongs === 0) return {}
  
  // Calculate wrap-around distance from center
  let distance = index - activeIndex.value
  
  // Handle wrap-around for infinite effect
  if (distance > totalSongs / 2) {
    distance -= totalSongs
  } else if (distance < -totalSongs / 2) {
    distance += totalSongs
  }
  
  // Calculate transform, scale, and opacity based on distance
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

// Navigation functions
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

// Select song - click any card to bring it to center, or center card to navigate
const selectSong = (song, index) => {
  if (index === activeIndex.value) {
    // Center card clicked - navigate to now-playing
    const genre = router.currentRoute.value.params.genre
    const encodedTitle = encodeURIComponent(song.title)
    router.push(`/now-playing/${genre}/${encodedTitle}`)
  } else {
    // Side card clicked - bring it to center
    const distance = index - activeIndex.value
    
    // Handle wrap-around
    if (distance > props.songs.length / 2) {
      // Clicked card is "before" center (wrap-around)
      for (let i = 0; i < props.songs.length - distance; i++) {
        previousSong()
      }
    } else if (distance < -props.songs.length / 2) {
      // Clicked card is "after" center (wrap-around)
      for (let i = 0; i < props.songs.length + distance; i++) {
        nextSong()
      }
    } else if (distance > 0) {
      // Clicked card is after center
      for (let i = 0; i < distance; i++) {
        nextSong()
      }
    } else {
      // Clicked card is before center
      for (let i = 0; i < Math.abs(distance); i++) {
        previousSong()
      }
    }
  }
}

// Keyboard controls
const handleKeydown = (event) => {
  if (event.key === 'ArrowLeft') {
    previousSong()
  } else if (event.key === 'ArrowRight') {
    nextSong()
  }
}

// Handle image loading errors
const handleImageError = (event) => {
  // Set a placeholder if image fails to load
  event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LXNpemU9IjE0Ij5ObyBJbWFnZTwvdGV4dD4KPC9zdmc+'
}
</script>

<style scoped>
.song-carousel {
  position: relative;
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 0;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
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
  width: 280px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform-style: preserve-3d;
}

.card-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 260px;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.song-card:hover .card-content {
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
  transform: translateY(-5px);
}

.cover-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.song-card:hover .cover-image {
  transform: scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.song-info {
  color: #333;
}

.song-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 6px 0;
  color: #333;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.song-artist {
  font-size: 0.9rem;
  margin: 0;
  color: #666;
  font-weight: 500;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.carousel-arrow:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
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
  color: #333;
  width: 28px;
  height: 28px;
}

/* Responsive design */
@media (max-width: 768px) {
  .song-carousel {
    height: 450px;
  }
  
  .carousel-arrow {
    width: 48px;
    height: 48px;
  }
  
  .carousel-arrow.left {
    left: 20px;
  }
  
  .carousel-arrow.right {
    right: 20px;
  }
  
  .song-card {
    width: 240px;
    height: 350px;
  }
  
  .card-content {
    max-width: 220px;
    padding: 15px;
  }
  
  .cover-image {
    height: 180px;
  }
  
  .song-title {
    font-size: 1rem;
  }
  
  .song-artist {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .song-carousel {
    height: 400px;
  }
  
  .carousel-arrow {
    width: 40px;
    height: 40px;
  }
  
  .carousel-arrow.left {
    left: 15px;
  }
  
  .carousel-arrow.right {
    right: 15px;
  }
  
  .carousel-arrow svg {
    width: 20px;
    height: 20px;
  }
  
  .song-card {
    width: 200px;
    height: 300px;
  }
  
  .card-content {
    max-width: 180px;
    padding: 12px;
  }
  
  .cover-image {
    height: 150px;
  }
  
  .song-title {
    font-size: 0.9rem;
  }
  
  .song-artist {
    font-size: 0.8rem;
  }
}
</style>