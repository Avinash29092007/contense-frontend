export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border)]">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-surface-3)] border border-[var(--color-border)]">
          <Icon size={20} className="text-[var(--color-text-faint)]" />
        </div>
      )}
      <p className="font-display text-[15px] font-medium text-[var(--color-text)]">{title}</p>
      {description && <p className="mt-1.5 max-w-[320px] text-[13.5px] text-[var(--color-text-muted)]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
