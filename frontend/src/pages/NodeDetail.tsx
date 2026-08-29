import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { nodeAPI, previewAPI } from '../api/client';
import '../styles/global.css';

interface NodeDetail {
  _id: string;
  name: string;
  url: string;
  status: 'live' | 'stopped' | 'unstable';
  statusCode: number;
  responseTime: number;
  isMonitoring: boolean;
  lastChecked?: string;
  description?: string;
}

interface Preview {
  title: string;
  content: string;
  statusCode: number;
  lastFetched: string;
}

const NodeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [node, setNode] = useState<NodeDetail | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    if (id) {
      fetchNodeDetail();
    }
  }, [id]);

  useEffect(() => {
    if (node?.isMonitoring) {
      const interval = setInterval(() => {
        fetchNodeStatus();
      }, 30000); // Check every 30 seconds
      setRefreshInterval(interval);

      return () => clearInterval(interval);
    }
  }, [node?.isMonitoring, id]);

  const fetchNodeDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const response = await nodeAPI.get(id);
      setNode(response.data);
      // Add to history
      setStatusHistory((prev) => [
        ...prev,
        {
          status: response.data.status,
          timestamp: new Date(),
          responseTime: response.data.responseTime,
        },
      ]);
    } catch (error) {
      console.error('Error fetching node:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNodeStatus = async () => {
    if (!id) return;
    try {
      const response = await nodeAPI.getStatus(id);
      setNode((prev) => (prev ? { ...prev, ...response.data } : null));
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const fetchLivePreview = async () => {
    if (!id) return;
    setPreviewLoading(true);
    try {
      const response = await previewAPI.getLive(id);
      setPreview(response.data);
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleStartMonitoring = async () => {
    if (!id) return;
    try {
      await nodeAPI.startMonitoring(id);
      setNode((prev) =>
        prev ? { ...prev, isMonitoring: true } : null
      );
    } catch (error) {
      console.error('Error starting monitoring:', error);
    }
  };

  const handleStopMonitoring = async () => {
    if (!id) return;
    try {
      await nodeAPI.stopMonitoring(id);
      setNode((prev) =>
        prev ? { ...prev, isMonitoring: false } : null
      );
    } catch (error) {
      console.error('Error stopping monitoring:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'var(--success)';
      case 'stopped':
        return 'var(--danger)';
      case 'unstable':
        return 'var(--warning)';
      default:
        return 'var(--text)';
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <button className="btn" onClick={() => navigate('/dashboard')}>
          ← BACK
        </button>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!node) {
    return (
      <div style={styles.container}>
        <div className="card">
          <p style={styles.error}>Node not found</p>
        </div>
        <button className="btn" onClick={() => navigate('/dashboard')}>
          ← BACK
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <button className="btn btn-small" onClick={() => navigate('/dashboard')}>
          ← BACK TO DASHBOARD
        </button>
        <h1 style={styles.title} className="glow-text">
          {node.name}
        </h1>
      </header>

      <div className="container" style={styles.content}>
        {/* Status Panel */}
        <div className="card">
          <h2 className="card-title">Node Status</h2>
          <div className="grid grid-2">
            <div>
              <p style={styles.detail}>
                <strong>Status:</strong>
                <span style={{ color: getStatusColor(node.status), marginLeft: '10px' }}>
                  {node.status.toUpperCase()}
                </span>
              </p>
              <p style={styles.detail}>
                <strong>Status Code:</strong> {node.statusCode}
              </p>
              <p style={styles.detail}>
                <strong>Response Time:</strong> {node.responseTime}ms
              </p>
              <p style={styles.detail}>
                <strong>Monitoring:</strong>{' '}
                <span
                  style={{
                    color: node.isMonitoring ? 'var(--success)' : 'var(--danger)',
                  }}
                >
                  {node.isMonitoring ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </p>
            </div>

            <div>
              <p style={styles.detail}>
                <strong>URL:</strong>
                <br />
                <a
                  href={node.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  {node.url}
                </a>
              </p>
              <p style={styles.detail}>
                <strong>Last Checked:</strong>{' '}
                {node.lastChecked
                  ? new Date(node.lastChecked).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>

          <div style={styles.actions}>
            {node.isMonitoring ? (
              <button className="btn btn-danger" onClick={handleStopMonitoring}>
                STOP MONITORING
              </button>
            ) : (
              <button className="btn btn-success" onClick={handleStartMonitoring}>
                START MONITORING
              </button>
            )}
            <button className="btn" onClick={fetchNodeStatus}>
              REFRESH STATUS
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="card">
          <h2 className="card-title">Live Preview</h2>
          <p style={styles.detail}>
            View the current state of the website in real-time
          </p>

          {previewLoading ? (
            <div className="spinner"></div>
          ) : preview ? (
            <div style={styles.preview}>
              <div style={styles.previewHeader}>
                <h3 style={styles.previewTitle}>{preview.title}</h3>
                <small style={styles.previewTime}>
                  Fetched: {new Date(preview.lastFetched).toLocaleString()}
                </small>
              </div>

              <div style={styles.previewContent}>
                <iframe
                  srcDoc={preview.content}
                  style={{
                    width: '100%',
                    height: '400px',
                    border: '2px solid var(--border)',
                    borderRadius: '4px',
                  }}
                  title="Website Preview"
                />
              </div>
            </div>
          ) : (
            <p style={styles.empty}>No preview available</p>
          )}

          <button className="btn" onClick={fetchLivePreview}>
            {previewLoading ? 'LOADING PREVIEW...' : 'LOAD LIVE PREVIEW'}
          </button>
        </div>

        {/* Status History */}
        <div className="card">
          <h2 className="card-title">Status History</h2>
          {statusHistory.length === 0 ? (
            <p style={styles.empty}>No history yet</p>
          ) : (
            <div style={styles.history}>
              {statusHistory.slice(-10).map((entry, index) => (
                <div key={index} style={styles.historyEntry}>
                  <span
                    style={{
                      color: getStatusColor(entry.status),
                      fontWeight: 'bold',
                    }}
                  >
                    {entry.status.toUpperCase()}
                  </span>
                  <span style={styles.historyTime}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  <span>Response: {entry.responseTime}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>&gt; Node: {node.name} | Status: {node.status.toUpperCase()}</p>
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
    padding: '20px',
    boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
  },
  title: {
    fontSize: '24px',
    color: 'var(--primary)',
    marginTop: '10px',
  },
  content: {
    flex: 1,
    padding: '30px 0',
  },
  detail: {
    fontSize: '14px',
    marginBottom: '12px',
    lineHeight: '1.6',
  },
  link: {
    color: 'var(--primary)',
    textDecoration: 'none',
    wordBreak: 'break-all' as const,
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  preview: {
    marginBottom: '20px',
  },
  previewHeader: {
    marginBottom: '15px',
  },
  previewTitle: {
    fontSize: '16px',
    color: 'var(--primary)',
    margin: '0 0 5px 0',
  },
  previewTime: {
    color: 'var(--text)',
    fontSize: '12px',
  },
  previewContent: {
    marginBottom: '15px',
  },
  empty: {
    textAlign: 'center' as const,
    color: 'var(--text)',
    fontStyle: 'italic',
  },
  history: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  historyEntry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'var(--darker)',
    borderRadius: '4px',
    fontSize: '12px',
    borderLeft: '3px solid var(--primary)',
  },
  historyTime: {
    color: 'var(--text)',
    fontSize: '12px',
  },
  error: {
    color: 'var(--danger)',
    textAlign: 'center' as const,
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

export default NodeDetail;
