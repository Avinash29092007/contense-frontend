import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Check } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import * as api from '../services/api';

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [topicName, setTopicName] = useState('');
  const [taskName, setTaskName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  async function finish() {
    setSubmitting(true);
    await api.completeOnboarding({ topicName, taskName });
    setSubmitting(false);
    navigate('/app');
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-ink)] px-5 py-12">
      <div className="grid-texture pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_20%,black,transparent)]" />
      <div className="relative w-full max-w-[440px]">
        <div className="mb-8 flex items-center justify-center gap-2 font-display text-[15px] font-semibold">
          <Activity size={18} className="text-[var(--color-accent)]" />
          Cadence
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">
          {[0, 1].map((i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-[var(--color-accent)]' : i < step ? 'w-4 bg-[var(--color-accent-soft)]' : 'w-4 bg-[var(--color-surface-3)]'}`} />
          ))}
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] card-shadow p-8">
          <AnimatePresence mode="wait">
            {step === 0 ? (
              <motion.div key="topic" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                <h1 className="font-display text-[21px] font-semibold">Create something you want to stay consistent with</h1>
                <p className="mt-2 text-[13.5px] text-[var(--color-text-muted)]">
                  This can be anything: a discipline, a craft, a relationship, a body of work. There's nothing predefined here, so name it the way you actually think about it.
                </p>
                <Input
                  className="mt-6"
                  label="Topic name"
                  placeholder="e.g. Morning Pages, Guitar, Sales Pipeline"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  autoFocus
                />
                <Button className="mt-6 w-full" size="lg" icon={ArrowRight} iconPosition="right" disabled={!topicName.trim()} onClick={() => setStep(1)}>
                  Continue
                </Button>
              </motion.div>
            ) : (
              <motion.div key="task" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                <h1 className="font-display text-[21px] font-semibold">Add the first task inside "{topicName}"</h1>
                <p className="mt-2 text-[13.5px] text-[var(--color-text-muted)]">
                  What's the smallest recurring action that would make this real? You can add more tasks and adjust points later.
                </p>
                <Input
                  className="mt-6"
                  label="Task name"
                  placeholder="e.g. Write one page"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  autoFocus
                />
                <div className="mt-6 flex gap-3">
                  <Button variant="secondary" className="flex-1" size="lg" onClick={() => setStep(0)}>
                    Back
                  </Button>
                  <Button className="flex-1" size="lg" icon={Check} iconPosition="right" disabled={!taskName.trim() || submitting} onClick={finish}>
                    {submitting ? 'Setting up...' : 'Enter Cadence'}
                  </Button>
                </div>
                <button
                  onClick={finish}
                  className="mt-4 w-full text-center text-[12.5px] text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] transition-colors"
                >
                  Skip for now, I'll add tasks later
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
