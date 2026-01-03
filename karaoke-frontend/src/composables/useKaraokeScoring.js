import { ref, computed } from 'vue'

export function useKaraokeScoring() {
    const score = ref(0)
    const isScoring = ref(false)
    const originalAudioData = ref([])
    const microphoneAudioData = ref([])
    const scoringComplete = ref(false)

    let audioContext = null
    let originalAnalyser = null
    let microphoneAnalyser = null
    let originalDataArray = null
    let microphoneDataArray = null
    let rafId = null
    let scoringInterval = null

    async function initializeScoring(audioElement, microphoneStream) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)()
            
            const originalSource = audioContext.createMediaElementSource(audioElement)
            originalAnalyser = audioContext.createAnalyser()
            originalAnalyser.fftSize = 2048
            originalSource.connect(originalAnalyser)
            originalAnalyser.connect(audioContext.destination)
            
            const microphoneSource = audioContext.createMediaStreamSource(microphoneStream)
            microphoneAnalyser = audioContext.createAnalyser()
            microphoneAnalyser.fftSize = 2048
            microphoneSource.connect(microphoneAnalyser)
            
            originalDataArray = new Uint8Array(originalAnalyser.frequencyBinCount)
            microphoneDataArray = new Uint8Array(microphoneAnalyser.frequencyBinCount)
            
            originalAudioData.value = []
            microphoneAudioData.value = []
            
            isScoring.value = true
            scoringComplete.value = false
            score.value = 0
            
            console.log("Scoring system initialized")
        } catch (err) {
            console.error("Error initializing scoring:", err)
        }
    }

    function startScoring() {
        if (!isScoring.value) return
        
        scoringInterval = setInterval(() => {
            if (originalAnalyser && microphoneAnalyser) {
                originalAnalyser.getByteFrequencyData(originalDataArray)
                const originalVolume = calculateVolume(originalDataArray)
                originalAudioData.value.push(originalVolume)
                
                microphoneAnalyser.getByteFrequencyData(microphoneDataArray)
                const microphoneVolume = calculateVolume(microphoneDataArray)
                microphoneAudioData.value.push(microphoneVolume)
            }
        }, 100)
    }

    function calculateVolume(dataArray) {
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i]
        }
        return sum / dataArray.length
    }

    function stopScoring() {
        if (scoringInterval) {
            clearInterval(scoringInterval)
            scoringInterval = null
        }
        
        if (isScoring.value && originalAudioData.value.length > 0) {
            calculateFinalScore()
        }
        
        isScoring.value = false
    }

    function calculateFinalScore() {
        if (originalAudioData.value.length === 0 || microphoneAudioData.value.length === 0) {
            score.value = 0
            scoringComplete.value = true
            return
        }
        
        const avgMicrophoneVolume = microphoneAudioData.value.reduce((sum, vol) => sum + vol, 0) / microphoneAudioData.value.length
        
        if (avgMicrophoneVolume < 5) {
            score.value = Math.floor(Math.random() * 10)
            scoringComplete.value = true
            console.log(`Microphone muted or very low volume. Score: ${score.value}`)
            return
        }
        
        const minLength = Math.min(originalAudioData.value.length, microphoneAudioData.value.length)
        let totalDifference = 0
        let matchCount = 0
        
        for (let i = 0; i < minLength; i++) {
            const original = originalAudioData.value[i]
            const microphone = microphoneAudioData.value[i]
            
            const normalizedOriginal = original / 255
            const normalizedMicrophone = microphone / 255
            
            const difference = Math.abs(normalizedOriginal - normalizedMicrophone)
            totalDifference += difference
            
            if (difference < 0.3) {
                matchCount++
            }
        }
        
        const matchPercentage = (matchCount / minLength) * 100
        const differenceScore = Math.max(0, 100 - (totalDifference / minLength) * 200)
        
        score.value = Math.round((matchPercentage + differenceScore) / 2)
        score.value = Math.min(100, Math.max(0, score.value))
        
        scoringComplete.value = true
        console.log(`Final score: ${score.value}, Avg mic volume: ${avgMicrophoneVolume.toFixed(2)}`)
    }

    function reset() {
        score.value = 0
        isScoring.value = false
        scoringComplete.value = false
        originalAudioData.value = []
        microphoneAudioData.value = []

        if (scoringInterval) {
            clearInterval(scoringInterval)
            scoringInterval = null
        }
        
        if (audioContext) {
            audioContext.close()
            audioContext = null
        }
        
        originalAnalyser = null
        microphoneAnalyser = null
        originalDataArray = null
        microphoneDataArray = null
    }

    return {
        score,
        isScoring,
        scoringComplete,
        initializeScoring,
        startScoring,
        stopScoring,
        reset
    }
}