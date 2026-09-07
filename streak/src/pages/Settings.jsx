import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AppHeader from '../components/AppHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <p className="text-[13.5px] font-medium text-[var(--color-text)]">{label}</p>
        {description && <p className="mt-0.5 text-[12px] text-[var(--color-text-faint)]">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${checked ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-surface-3)]'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${checked ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

export default function Settings() {
  const { user, setUser } = useAppData();
  const { signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [notifDaily, setNotifDaily] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  async function saveProfile(e) {
    e.preventDefault();
    await setUser({ name });
    toast.push({ type: 'success', message: 'Profile updated' });
  }

  return (
    <div>
      <AppHeader title="Settings" />
      <main className="px-5 py-6 md:px-8 md:py-8 max-w-2xl mx-auto flex flex-col gap-5">
        <Card className="p-5 md:p-6">
          <h3 className="font-display text-[14px] font-semibold">Profile</h3>
          <form onSubmit={saveProfile} className="mt-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-accent-dim)] border border-[var(--color-accent-soft)] font-display text-[19px] font-semibold text-[var(--color-accent)]">
                {user?.avatarInitial}
              </div>
              <div>
                <p className="text-[13.5px] font-medium">{user?.email}</p>
                <p className="text-[12px] text-[var(--color-text-faint)]">Joined {user?.joinedAt}</p>
              </div>
            </div>
            <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
            <div>
              <Button type="submit" size="sm">Save changes</Button>
            </div>
          </form>
        </Card>

        <Card className="p-5 md:p-6">
          <h3 className="font-display text-[14px] font-semibold">Appearance</h3>
          <div className="mt-1 divide-y divide-[var(--color-border-soft)]">
            <ToggleRow label="Reduce motion" description="Minimize animations across the app" checked={reduceMotion} onChange={setReduceMotion} />
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <h3 className="font-display text-[14px] font-semibold">Notifications</h3>
          <div className="mt-1 divide-y divide-[var(--color-border-soft)]">
            <ToggleRow label="Daily reminder" description="A nudge if tasks are still open in the evening" checked={notifDaily} onChange={setNotifDaily} />
            <ToggleRow label="Streak alerts" description="Warn me before a streak is about to break" checked={notifStreak} onChange={setNotifStreak} />
          </div>
        </Card>

        <Card className="p-5 md:p-6">
          <h3 className="font-display text-[14px] font-semibold">Account</h3>
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="secondary" icon={LogOut} onClick={() => { signOut(); navigate('/'); }} className="justify-start">
              Sign out
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
