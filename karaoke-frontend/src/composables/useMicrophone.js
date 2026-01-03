import { ref } from "vue"

export function useMicrophone() {
    const isActive = ref(false)
    const error = ref(null)
    const volume =ref(0)

    let audioContext = null
    let analyser = null
    let dataArray = null
    let rafId = null

    async function startMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            audioContext = new AudioContext()
            analyser = audioContext.createAnalyser()
            analyser.fftSize = 2048

            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)

            dataArray = new Uint8Array(analyser.fftSize)

            isActive.value = true
            console.log("audio pipeline ready")

            monitorVolume()
        } catch (err) {
            error.value = err
            console.log(err)
        }
    }

    function monitorVolume() {
        if (!analyser || !dataArray) return

        analyser.getByteTimeDomainData(dataArray)

        let sumSquares = 0
        for (let i = 0; i < dataArray.length; i++) {
            const v =dataArray[i] - 128
            sumSquares += v * v
        }
        volume.value = Math.sqrt(sumSquares / dataArray.length)

        rafId = requestAnimationFrame(monitorVolume)
    }

    function stopMicrophone() {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = null

        if (audioContext) audioContext.close()
        audioContext = null
        analyser = null
        dataArray = null

        isActive.value = false
        volume.value = 0
    }

    return {
        startMicrophone,
        stopMicrophone,
        isActive,
        volume,
        error
    }
}