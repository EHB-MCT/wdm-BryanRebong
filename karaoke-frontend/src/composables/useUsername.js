import { ref } from 'vue'

const username = ref('')

export function useUsername() {
    const setUsername = (newUsername) => {
        username.value = newUsername
    }

    const clearUsername = () => {
        username.value = ''
    }

    return {
        username,
        setUsername,
        clearUsername
    }
}