import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

export default function Dropdown({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.12 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className={clsx(
              'absolute top-[calc(100%+8px)] z-40 min-w-[180px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-2)] card-shadow py-1.5 overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0'
            )}
            role="menu"
          >
            {items.map((item, i) =>
              item.divider ? (
                <div key={i} className="my-1.5 h-px bg-[var(--color-border-soft)]" />
              ) : (
                <button
                  key={i}
                  role="menuitem"
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={clsx(
                    'flex w-full items-center gap-2.5 px-3.5 py-2 text-[13.5px] text-left transition-colors',
                    item.danger
                      ? 'text-[var(--color-bad)] hover:bg-[#2a1216]'
                      : 'text-[var(--color-text)] hover:bg-white/[0.05]'
                  )}
                >
                  {item.icon && <item.icon size={15} />}
                  {item.label}
                </button>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
