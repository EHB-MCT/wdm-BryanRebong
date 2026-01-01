<template>
    <div class="home">
        <h1>Welcome to KaraoKey!</h1>

        <button @click="handleStartSinging" class="btn-standard">Start Singing</button>

        <div v-if="showUsernamePopup" class="username-popup">
            <div class="popup-content">
                <h3>Enter your username:</h3>

                <input
                    v-model="tempUsername"
                    type="text"
                    placeholder="Username"
                    @keyup.enter="saveUsername"
                    :disabled="loading"
                />

                <div class="popup-buttons">
                    <button @click="saveUsername" :disabled="loading" class="btn-compact">
                        {{ loading ? "Saving..." : "Save" }}
                    </button>
                    <button @click="cancelUsername" :disabled="loading" class="btn-compact">
                        Cancel
                    </button>
                </div>

                <p v-if="error" class="error">{{ error }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsername } from "../composables/useUsername.js";
import { createOrGetUser } from "../api/users.js";
import { useSession } from "../composables/useSession.js";

const router = useRouter();
const { setUsername } = useUsername();
const { startSession } = useSession();

const showUsernamePopup = ref(false);
const tempUsername = ref("");
const loading = ref(false);
const error = ref("");

const handleStartSinging = () => {
    error.value = "";
    showUsernamePopup.value = true;
};

const saveUsername = async () => {
    const clean = tempUsername.value.trim();
    if (!clean) return;

    loading.value = true;
    error.value = "";

    try {
        const user = await createOrGetUser(clean);

        setUsername(user.username);

        localStorage.setItem("karaoke_uid", user.uid);
        localStorage.setItem("karaoke_username", user.username);

        startSession();

        showUsernamePopup.value = false;
        tempUsername.value = "";
        router.push("/genres");
    } catch (e) {
        error.value = e?.message || "Something went wrong";
    } finally {
        loading.value = false;
    }
};

const cancelUsername = () => {
  showUsernamePopup.value = false;
  tempUsername.value = "";
  error.value = "";
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap");

.home {
    font-family: "Lato", system-ui, Avenir, Helvetica, Arial, sans-serif;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    color: white;
}

.home h1 {
    font-size: 4rem;
    font-weight: 700;
    margin-bottom: 2rem;
    color: white;
    text-shadow: 
        -2px -2px 0 rgba(0, 0, 0, 0.8),
        2px -2px 0 rgba(0, 0, 0, 0.8),
        -2px 2px 0 rgba(0, 0, 0, 0.8),
        2px 2px 0 rgba(0, 0, 0, 0.8);
}

.username-popup {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
    border: 3px solid #ffd700;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    z-index: 1000;
}

.popup-content h3 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: white;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.popup-content input {
    width: 220px;
    padding: 12px;
    margin-bottom: 15px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 16px;
    backdrop-filter: blur(5px);
}

.popup-content input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.popup-content input:focus {
    outline: 2px solid #ffd700;
    outline-offset: 2px;
}

.popup-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 10px;
}

.error {
    color: #ff6b6b;
    margin-top: 15px;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}
</style>
