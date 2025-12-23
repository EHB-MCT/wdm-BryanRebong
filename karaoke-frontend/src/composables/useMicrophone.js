import { ref } from "vue"

export function useMicrophone() {
    const isActive = ref(false)
    const error = ref(null)

    let audioContext = null
    let analyser = null
    let dataArray = null

    async function startMicrophone() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            audioContext = new AudioContext()
            analyser = audioContext.createAnalyser()
            analyser.fftSize = 2048

            const source = audioContext.createMediaStreamSource(stream)
            source.connect(analyser)

            dataArray = new Uint8Array(analyser.fftSize)

            analyser.getByteTimeDomainData(dataArray)
            console.log("Audio buffer lenght:",dataArray.length)
            console.log("First 10 samples:", Array.from(dataArray.slice(0, 10)))

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