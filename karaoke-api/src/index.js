import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/users", async (req, res) => {
    const { username } = req.body;

    if (!username || typeof username !== "string" || username.trim().length < 2) {
        return res.status(400).json({ error: "Username must be at least 2 characters." });
    }

    const clean = username.trim();

    try {
        const existing = await pool.query(
            "SELECT id, username FROM users WHERE username = $1",
            [clean]
    );

    if (existing.rows.length > 0) {
        return res.json({ uid: existing.rows[0].id, username: existing.rows[0].username });
    }

    const created = await pool.query(
        "INSERT INTO users (username) VALUES ($1) RETURNING id, username",
        [clean]
    );

    res.status(201).json({ uid: created.rows[0].id, username: created.rows[0].username });
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API running on :${port}`));
