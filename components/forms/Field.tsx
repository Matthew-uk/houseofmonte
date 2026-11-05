import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

const LABEL = "text-meta uppercase text-muted";
const CONTROL =
  "w-full border border-line bg-bg px-3 text-body focus:border-fg aria-invalid:border-accent";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  /** A control inside the input's right edge, e.g. a show-password button. */
  trailing?: ReactNode;
}

// DESIGN.md §5 Forms: meta label above, hairline input, error below in accent.
export function Field({ label, name, error, id, trailing, ...input }: FieldProps) {
  const inputId = id ?? name;
  const errorId = `${inputId}-error`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className={LABEL}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${CONTROL} h-11 ${trailing ? "pr-16" : ""}`}
          {...input}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center">{trailing}</div>}
      </div>
      {error && (
        <p id={errorId} className="text-meta text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
}

export function TextAreaField({ label, name, id, ...input }: TextAreaFieldProps) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className={LABEL}>
        {label}
      </label>
      <textarea id={inputId} name={name} rows={4} className={`${CONTROL} py-2`} {...input} />
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  children: ReactNode;
}

export function SelectField({ label, name, id, children, ...input }: SelectFieldProps) {
  const inputId = id ?? name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className={LABEL}>
        {label}
      </label>
      <select id={inputId} name={name} className={`${CONTROL} h-11`} {...input}>
        {children}
      </select>
    </div>
  );
}
