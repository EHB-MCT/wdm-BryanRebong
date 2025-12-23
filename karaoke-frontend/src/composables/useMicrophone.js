import { ref } from "vue"

export function useMicrophone() {
    const isActive = ref(false)
    const error = ref(null)

    async function startMicrophone() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true })
            isActive.value = true
            console.log("Microphone permission granted")
        } catch (err) {
            error.value = err
        }
    }

    return {
        startMicrophone,
        isActive,
        error
    }
}