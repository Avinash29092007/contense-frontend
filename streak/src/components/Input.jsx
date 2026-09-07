import { forwardRef, useId, useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(function Input(
  { label, error, hint, type = 'text', className, containerClassName, id, ...props },
  ref
) {
  const autoId = useId();
  const inputId = id || autoId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-[var(--color-text-muted)]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={clsx(
            'w-full rounded-[var(--radius-xs)] bg-[var(--color-surface-2)] border px-3.5 py-2.5 text-[14px] text-[var(--color-text)] placeholder:text-[var(--color-text-faint)] transition-colors duration-150 outline-none',
            error
              ? 'border-[var(--color-bad)] focus:border-[var(--color-bad)]'
              : 'border-[var(--color-border)] focus:border-[var(--color-accent)]',
            isPassword && 'pr-10',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="text-[12.5px] text-[var(--color-bad)]">
          {error}
        </span>
      )}
      {!error && hint && (
        <span id={`${inputId}-hint`} className="text-[12.5px] text-[var(--color-text-faint)]">
          {hint}
        </span>
      )}
    </div>
  );
});

export default Input;
