<template>
    <div class="home">
        <h1>Welcome to KaraoKey!</h1>

        <button @click="handleStartSinging">Start Singing</button>

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
                    <button @click="saveUsername" :disabled="loading">
                        {{ loading ? "Saving..." : "Save" }}
                    </button>
                    <button @click="cancelUsername" :disabled="loading">
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
    background: transparent;
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
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.popup-content h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
}

.popup-content input {
    width: 200px;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.popup-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.popup-buttons button {
    padding: 6px 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
}

.popup-buttons button:first-child {
    background: #007bff;
    color: white;
    border-color: #007bff;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>
