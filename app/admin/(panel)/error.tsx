"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <p role="alert" className="text-body text-accent">
      Something went wrong.{" "}
      <button type="button" onClick={reset} className="underline">
        Try again
      </button>
    </p>
  );
}
