"use client";

export default function StoreError({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="flex min-h-[60dvh] items-center justify-center px-3 text-center">
      <p role="alert" className="text-ui uppercase text-accent">
        Something went wrong —{" "}
        <button type="button" onClick={reset} className="uppercase underline underline-offset-4">
          Try again
        </button>
      </p>
    </section>
  );
}
