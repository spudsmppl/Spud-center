import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useNodeStore } from '../store';
import { nodeAPI } from '../api/client';
import '../styles/global.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const nodes = useNodeStore((state) => state.nodes);
  const setNodes = useNodeStore((state) => state.addNode);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newNode, setNewNode] = useState({ name: '', url: '', description: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchNodes();
  }, [user, navigate]);

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const response = await nodeAPI.list();
      useNodeStore.setState({ nodes: response.data });
    } catch (error) {
      console.error('Error fetching nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await nodeAPI.create(newNode);
      useNodeStore.setState((state) => ({
        nodes: [...state.nodes, response.data.node],
      }));
      setNewNode({ name: '', url: '', description: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error creating node:', error);
    }
  };

  const handleDeleteNode = async (id: string) => {
    if (confirm('Are you sure you want to delete this node?')) {
      try {
        await nodeAPI.delete(id);
        useNodeStore.setState((state) => ({
          nodes: state.nodes.filter((node) => node._id !== id),
        }));
      } catch (error) {
        console.error('Error deleting node:', error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'status-live';
      case 'stopped':
        return 'status-stopped';
      case 'unstable':
        return 'status-unstable';
      default:
        return 'status-stopped';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title} className="glow-text">
            [SPUD-CENTER]
          </h1>
          <div style={styles.headerRight}>
            <span style={styles.userInfo}>User: {user?.email}</span>
            <button className="btn btn-small" onClick={handleLogout}>
              LOGOUT
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={styles.main}>
        <div className="container">
          {/* Control panel */}
          <div style={styles.controlPanel}>
            <h2 style={styles.sectionTitle}>Control Panel</h2>
            <button className="btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'CANCEL' : '+ ADD NEW NODE'}
            </button>
          </div>

          {/* Add node form */}
          {showForm && (
            <div className="card slide-in">
              <h3 className="card-title">Create New Node</h3>
              <form onSubmit={handleAddNode} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Node Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newNode.name}
                    onChange={(e) =>
                      setNewNode({ ...newNode, name: e.target.value })
                    }
                    placeholder="e.g., node-1"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Website URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={newNode.url}
                    onChange={(e) =>
                      setNewNode({ ...newNode, url: e.target.value })
                    }
                    placeholder="https://example.com"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newNode.description}
                    onChange={(e) =>
                      setNewNode({ ...newNode, description: e.target.value })
                    }
                    placeholder="Node description"
                  />
                </div>

                <button type="submit" className="btn">
                  CREATE NODE
                </button>
              </form>
            </div>
          )}

          {/* Nodes grid */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Active Nodes</h2>

            {loading ? (
              <div className="spinner"></div>
            ) : nodes.length === 0 ? (
              <div className="card">
                <p style={styles.empty}>
                  No nodes created yet. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-3">
                {nodes.map((node) => (
                  <div
                    key={node._id}
                    className="card"
                    onClick={() => navigate(`/node/${node._id}`)}
                    style={styles.nodeCard}
                  >
                    <div style={styles.nodeHeader}>
                      <h3 style={styles.nodeName}>{node.name}</h3>
                      <div className={`status-indicator ${getStatusColor(node.status)}`}></div>
                    </div>

                    <div style={styles.nodeInfo}>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span
                          style={{
                            color:
                              node.status === 'live'
                                ? 'var(--success)'
                                : node.status === 'unstable'
                                ? 'var(--warning)'
                                : 'var(--danger)',
                          }}
                        >
                          {node.status.toUpperCase()}
                        </span>
                      </p>
                      <p>
                        <strong>Status Code:</strong> {node.statusCode || 'N/A'}
                      </p>
                      <p>
                        <strong>Response Time:</strong> {node.responseTime}ms
                      </p>
                      <p style={styles.urlText}>
                        <strong>URL:</strong>{' '}
                        <a
                          href={node.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={styles.link}
                        >
                          {node.url}
                        </a>
                      </p>
                    </div>

                    <div style={styles.nodeActions}>
                      <button
                        className="btn btn-small"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/node/${node._id}`);
                        }}
                      >
                        VIEW
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNode(node._id);
                        }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&gt; SPUD-CENTER v1.0 | Status: OPERATIONAL</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: 'var(--dark)',
  },
  header: {
    backgroundColor: 'var(--secondary)',
    borderBottom: '2px solid var(--primary)',
    padding: '20px 0',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
  },
  headerRight: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  title: {
    fontSize: '28px',
    margin: 0,
    color: 'var(--primary)',
  },
  userInfo: {
    fontSize: '14px',
    color: 'var(--text)',
  },
  main: {
    flex: 1,
    padding: '40px 0',
  },
  controlPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    color: 'var(--primary)',
    marginBottom: '20px',
  },
  section: {
    marginBottom: '40px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  label: {
    fontSize: '12px',
    color: 'var(--primary)',
    marginBottom: '5px',
    fontWeight: 'bold',
    textTransform: 'uppercase' as const,
  },
  nodeCard: {
    cursor: 'pointer',
  },
  nodeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  nodeName: {
    fontSize: '16px',
    color: 'var(--primary)',
    margin: 0,
    fontWeight: 'bold',
  },
  nodeInfo: {
    fontSize: '12px',
    marginBottom: '15px',
    lineHeight: '1.8',
  },
  urlText: {
    wordBreak: 'break-all' as const,
  },
  link: {
    color: 'var(--primary)',
    textDecoration: 'none',
  },
  nodeActions: {
    display: 'flex',
    gap: '10px',
  },
  empty: {
    textAlign: 'center' as const,
    color: 'var(--text)',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: 'var(--secondary)',
    borderTop: '2px solid var(--primary)',
    padding: '15px',
    textAlign: 'center' as const,
    fontSize: '12px',
    color: 'var(--text)',
  },
};

export default Dashboard;
