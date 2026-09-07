import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-ink)] px-5 py-12">
      <div className="grid-texture pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_20%,black,transparent)]" />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[360px] w-[360px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[400px]"
      >
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-display text-[15px] font-semibold text-[var(--color-text)]">
          <Activity size={18} className="text-[var(--color-accent)]" />
          Cadence
        </Link>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow p-8">
          <h1 className="font-display text-[22px] font-semibold text-[var(--color-text)]">{title}</h1>
          {subtitle && <p className="mt-1.5 text-[13.5px] text-[var(--color-text-muted)]">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
        {footer && <div className="mt-6 text-center text-[13.5px] text-[var(--color-text-muted)]">{footer}</div>}
      </motion.div>
    </div>
  );
}
