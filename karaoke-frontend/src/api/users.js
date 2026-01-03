const apiUrl = import.meta.env.VITE_API_URL;

export async function createOrGetUser(username) {
    const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.error || "Failed to create user");
    }
    return data;
}

