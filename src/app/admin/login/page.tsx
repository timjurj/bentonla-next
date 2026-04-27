"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f14",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier Prime', monospace",
    }}>
      <div style={{ width: 320, textAlign: "center" }}>
        <h1 style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#f5f2eb",
          marginBottom: 8,
        }}>BentonLA</h1>
        <p style={{ fontSize: 11, color: "#666", letterSpacing: 2, textTransform: "uppercase", marginBottom: 28 }}>
          Admin Portal
        </p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && login()}
          placeholder="Enter password"
          style={{
            width: "100%",
            background: "#1a1a22",
            border: "1px solid #333",
            color: "#f5f2eb",
            fontFamily: "'Courier Prime', monospace",
            fontSize: 14,
            padding: "10px 14px",
            marginBottom: 12,
            boxSizing: "border-box" as const,
          }}
        />
        {error && <p style={{ color: "#cc0000", fontSize: 12, marginBottom: 12 }}>{error}</p>}
        <button
          onClick={login}
          style={{
            width: "100%",
            fontFamily: "'Oswald', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            background: "#f5f2eb",
            color: "#111",
            border: "none",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          Login »
        </button>
      </div>
    </div>
  );
}