"use client";

import { useEffect, useState } from "react";

export default function ConfirmView({ token }: { token: string | null }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid confirmation link");
      return;
    }
    async function fetchAPI() {
      try {
        const res = await fetch("/api/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setMessage(data.message ?? "Something went wrong");
          setDetails(data.details ?? "Failed to fetch details");
          setError(data.error ?? "Failed to fetch the error message");
          return;
        }

        setStatus("success");
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    }
    fetchAPI();
  }, [token]);

  if (status === "loading") return <p>Confirming your booking...</p>;
  if (status === "error")
    return (
      <div>
        <p>{message}</p>
        <p>{details}</p>
        <p>{error}</p>
      </div>
    );

  return <p>Booking confirmed!</p>;
}
