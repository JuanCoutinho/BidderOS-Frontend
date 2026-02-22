import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="dashboard-brand">
                    <img src={logo} alt="BidderOS" className="brand-logo" />
                </div>
                <button onClick={handleLogout} className="logout-button">
                    Sign Out
                </button>
            </header>

            <main className="dashboard-content">
                <div className="welcome-section">
                    <h1>
                        Welcome, <span className="gradient-text">{user?.name}</span>
                    </h1>
                    <p className="welcome-subtitle">Your BidderOS workspace is ready</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                                <polyline points="10 9 9 9 8 9" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Resumes</span>
                            <span className="stat-value">0</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Member since</span>
                            <span className="stat-value">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                            </span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Status</span>
                            <span className="stat-value">Active</span>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <h2>Account Details</h2>
                    <div className="info-grid">
                        <div className="info-row">
                            <span className="info-label">Name</span>
                            <span className="info-value">{user?.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Email</span>
                            <span className="info-value">{user?.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">User ID</span>
                            <span className="info-value">#{user?.id}</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
