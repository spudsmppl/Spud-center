import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();
  const { register, error, isLoading, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.title} className="glow-text">
          [SPUD-CENTER]
        </div>
        <p style={styles.subtitle}>Create Account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div className="alert alert-error">{error}</div>}
          {passwordError && <div className="alert alert-error">{passwordError}</div>}

          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              disabled={isLoading}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn"
            style={styles.button}
            disabled={isLoading}
          >
            {isLoading ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage:
      'linear-gradient(45deg, #0a0a14 0%, #0f0f23 50%, #0a0a14 100%)',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'var(--secondary)',
    border: '2px solid var(--primary)',
    borderRadius: '4px',
    padding: '40px',
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--primary)',
    marginBottom: '10px',
    textAlign: 'center' as const,
  },
  subtitle: {
    textAlign: 'center' as const,
    color: 'var(--text)',
    marginBottom: '30px',
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: 'var(--primary)',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
  },
  button: {
    marginTop: '10px',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: 'var(--text)',
  },
  link: {
    color: 'var(--primary)',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};

export default Register;
