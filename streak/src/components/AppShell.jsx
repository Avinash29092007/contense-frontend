import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

export default function AppShell() {
  return (
    <div className="flex min-h-screen bg-[var(--color-ink)]">
      <Sidebar />
      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
