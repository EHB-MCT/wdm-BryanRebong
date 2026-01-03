import { ref } from "vue";

const username = ref(localStorage.getItem("karaoke_username") || "");

export function useUsername() {
    const setUsername = (newUsername) => {
        username.value = newUsername;
        localStorage.setItem("karaoke_username", newUsername);
    };

    const clearUsername = () => {
        username.value = "";
        localStorage.removeItem("karaoke_username");
    };

    return { username, setUsername, clearUsername };
}


