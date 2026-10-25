import type { InputHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
}

// DESIGN.md §5 Forms: meta label above, hairline input, error below in accent.
export function Field({ label, name, error, id, ...input }: FieldProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-meta uppercase text-muted">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="h-11 border border-line bg-bg px-3 text-body outline-none focus:border-fg aria-invalid:border-accent"
        {...input}
      />
      {error && (
        <p id={errorId} className="text-meta text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
