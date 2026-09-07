import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Flame, Layers, LineChart, Sparkles, Activity } from 'lucide-react';
import MarketingNavbar from '../components/MarketingNavbar';
import Button from '../components/Button';
import ProgressRing from '../components/ProgressRing';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-ink)] text-[var(--color-text)]">
      <MarketingNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[var(--color-border-soft)]">
        <div className="grid-texture pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <div
          className="pointer-events-none absolute -top-32 right-[8%] h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--color-accent) 0%, transparent 70%)' }}
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-20 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-[12.5px] text-[var(--color-text-muted)]">
              <Sparkles size={13} className="text-[var(--color-accent)]" />
              Built around the things you decide matter
            </div>
            <h1 className="font-display text-[42px] font-semibold leading-[1.08] tracking-tight md:text-[56px]">
              Consistency,<br />made visible.
            </h1>
            <p className="mt-6 max-w-[440px] text-[16px] leading-relaxed text-[var(--color-text-muted)]">
              Cadence doesn't tell you what to do. You decide what matters, break it into daily practice,
              and watch the pattern take shape one honest day at a time.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/register')}>
                Start your streak
              </Button>
              <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                Sign in
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="relative mx-auto"
          >
            <div className="glass card-shadow relative rounded-[var(--radius-xl)] border border-[var(--color-border)] p-8">
              <div className="flex items-center gap-2 text-[12.5px] text-[var(--color-text-faint)]">
                <Activity size={13} className="text-[var(--color-accent)]" />
                12-day run
              </div>
              <div className="mt-5 flex items-center justify-center">
                <ProgressRing percent={78} size={172} stroke={11}>
                  <div className="text-center">
                    <p className="font-display tabular text-[30px] font-semibold leading-none">78%</p>
                    <p className="mt-1 text-[11.5px] text-[var(--color-text-faint)]">today</p>
                  </div>
                </ProgressRing>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
                  <p className="flex items-center gap-1.5 text-[11.5px] text-[var(--color-text-faint)]"><Flame size={12} className="text-[var(--color-warn)]" /> Current streak</p>
                  <p className="mt-1 font-display tabular text-[19px] font-semibold">12 days</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
                  <p className="text-[11.5px] text-[var(--color-text-faint)]">Total XP</p>
                  <p className="mt-1 font-display tabular text-[19px] font-semibold text-[var(--color-accent)]">4,260</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b border-[var(--color-border-soft)] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-lg">
            <h2 className="font-display text-[30px] font-semibold tracking-tight">You decide what matters. We help you stay consistent.</h2>
            <p className="mt-3 text-[15px] text-[var(--color-text-muted)]">No prescribed habits, no generic categories. Just the structure to keep showing up for your own version of the work.</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              { icon: Layers, title: 'Name your own topics', body: 'Create the areas of your life you care about, in your own words. Nothing is predefined for you.' },
              { icon: Flame, title: 'Show up daily', body: 'Complete tasks, earn points, and build a streak that reflects real effort, not a checklist someone else wrote.' },
              { icon: LineChart, title: 'Watch the shape of it', body: 'History, trends, and stats turn scattered days into a pattern you can actually see and trust.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--color-accent-dim)] border border-[var(--color-accent-soft)]">
                  <f.icon size={17} className="text-[var(--color-accent)]" />
                </div>
                <h3 className="mt-4 font-display text-[16px] font-semibold">{f.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-text-muted)]">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMIZATION */}
      <section id="customization" className="border-b border-[var(--color-border-soft)] py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <h2 className="font-display text-[28px] font-semibold tracking-tight">Your structure, not ours.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
              Most habit apps hand you a list of categories and call it personalization. Cadence starts empty
              on purpose. You name the topic, define the task, and set the points it's worth. The app adapts to
              your life instead of the other way around.
            </p>
            <ul className="mt-6 space-y-3 text-[14px] text-[var(--color-text-muted)]">
              {['Create unlimited topics with your own names', 'Set custom point values per task', 'Choose daily, weekday, or custom frequencies'].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                  {t}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow p-6"
          >
            {[
              { name: 'Deep Work', tasks: 2, color: 'var(--color-accent)' },
              { name: 'Body', tasks: 2, color: 'var(--color-cyan)' },
              { name: 'Craft Practice', tasks: 2, color: 'var(--color-good)' },
            ].map((t) => (
              <div key={t.name} className="flex items-center justify-between border-b border-[var(--color-border-soft)] py-3.5 last:border-0">
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                  <span className="text-[14px] font-medium">{t.name}</span>
                </div>
                <span className="text-[12.5px] text-[var(--color-text-faint)]">{t.tasks} tasks</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROGRESS PREVIEW */}
      <section id="progress" className="border-b border-[var(--color-border-soft)] py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="font-display text-[28px] font-semibold tracking-tight">Points and streaks, without the noise.</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-[var(--color-text-muted)]">
            Every completed task earns points. Every day you show up extends a streak. It's simple by design, so the
            only thing left to focus on is the work itself.
          </p>
          <div className="mt-12 flex justify-center gap-3 overflow-x-auto px-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="flex h-14 w-8 shrink-0 flex-col items-center justify-end rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-1"
              >
                <div
                  className="w-full rounded-[3px]"
                  style={{
                    height: `${[80,60,90,40,70,100,55,65,85,30,95,50,75,88][i]}%`,
                    background: i > 9 ? 'var(--color-accent)' : 'var(--color-surface-3)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-[32px] font-semibold tracking-tight">Start the streak that's actually yours.</h2>
          <p className="mt-4 text-[15px] text-[var(--color-text-muted)]">Free to try. No predefined habits. No backend required to see it in action.</p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" icon={ArrowRight} iconPosition="right" onClick={() => navigate('/register')}>
              Create your account
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--color-border-soft)] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-[12.5px] text-[var(--color-text-faint)] md:flex-row">
          <span className="flex items-center gap-2"><Activity size={14} className="text-[var(--color-accent)]" /> Cadence</span>
          <span>A frontend preview. No account data leaves your browser.</span>
        </div>
      </footer>
    </div>
  );
}
