import { Link, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import Button from './Button';

export default function MarketingNavbar() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border-soft)] bg-[var(--color-ink)]/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-[16px] font-semibold text-[var(--color-text)]">
          <Activity size={18} className="text-[var(--color-accent)]" strokeWidth={2.4} />
          Cadence
        </Link>
        <nav className="hidden items-center gap-8 text-[13.5px] text-[var(--color-text-muted)] md:flex">
          <a href="#how-it-works" className="hover:text-[var(--color-text)] transition-colors">How it works</a>
          <a href="#customization" className="hover:text-[var(--color-text)] transition-colors">Customization</a>
          <a href="#progress" className="hover:text-[var(--color-text)] transition-colors">Progress</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Sign in</Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/register')}>Get started</Button>
        </div>
      </div>
    </header>
  );
}
