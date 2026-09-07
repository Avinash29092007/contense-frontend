import clsx from 'clsx';

export default function Card({ className, children, as: Comp = 'div', hover = false, ...props }) {
  return (
    <Comp
      className={clsx(
        'rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow',
        hover && 'transition-colors duration-150 hover:border-[#2a3038]',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
