import { forwardRef } from 'react';
import clsx from 'clsx';

const VARIANTS = {
  primary: 'bg-[var(--color-accent)] text-white hover:bg-[#578bfb] active:bg-[#3568d9] shadow-[0_1px_0_rgba(255,255,255,0.15)_inset]',
  secondary: 'bg-[var(--color-surface-3)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[#2c333d] hover:bg-[#1a1e25]',
  ghost: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5',
  danger: 'bg-transparent text-[var(--color-bad)] border border-[#3a1c22] hover:bg-[#2a1216]',
};

const SIZES = {
  sm: 'text-xs px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-[15px] px-5 py-3 gap-2',
};

const Button = forwardRef(function Button(
  { as: Comp = 'button', variant = 'primary', size = 'md', className, children, icon: Icon, iconPosition = 'left', ...props },
  ref
) {
  return (
    <Comp
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center rounded-[var(--radius-xs)] font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} strokeWidth={2} />}
    </Comp>
  );
});

export default Button;
