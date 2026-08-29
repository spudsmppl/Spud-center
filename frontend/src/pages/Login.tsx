import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(email, password);
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
        <p style={styles.subtitle}>JARVIS Control Center v1.0</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div className="alert alert-error">{error}</div>}

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
              placeholder="Enter your password"
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
            {isLoading ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>

      <div style={styles.watermark}>
        &gt; System initialized - Awaiting authorization...
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
    position: 'relative' as const,
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'var(--secondary)',
    border: '2px solid var(--primary)',
    borderRadius: '4px',
    padding: '40px',
    boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)',
    zIndex: 10,
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
  watermark: {
    position: 'fixed' as const,
    bottom: '20px',
    left: '20px',
    color: 'rgba(0, 212, 255, 0.3)',
    fontSize: '12px',
    fontFamily: 'Courier New, monospace',
  },
};

export default Login;
