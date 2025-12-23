import { ref } from "vue"

export function useMicrophone() {
    const isActive = ref(false)
    const error = ref(null)

    let audioContext = null
    let analyser = null

    async function startMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            audioContext = new AudioContext()
            analyser = audioContext.createAnalyser()
            analyser.fftSize = 2048

            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)

            isActive.value = true
            console.log("Audiocontext and analyser connected")
        } catch (err) {
            error.value = err
            console.log(err)
        }
    }

    return {
        startMicrophone,
        isActive,
        error
    }
}