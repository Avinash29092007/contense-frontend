import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = 'Enter your name';
    if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email address';
    if (form.password.length < 6) next.password = 'Use at least 6 characters';
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await signUp(form);
    setLoading(false);
    navigate('/onboarding');
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Set up the space where your consistency lives."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-[var(--color-accent)] hover:text-[var(--color-cyan)]">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Input label="Name" placeholder="Your name" value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" />
        <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          value={form.password}
          onChange={update('password')}
          error={errors.password}
          autoComplete="new-password"
        />
        <Button type="submit" className="mt-1 w-full" size="lg" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  );
}
