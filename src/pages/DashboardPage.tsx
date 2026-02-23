import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';
import { useResumesQuery } from '../store/authApi';
import Sidebar from '../components/Sidebar';

export default function DashboardPage() {
    const user = useSelector((state: RootState) => state.auth.user);
    const { data: resumes } = useResumesQuery();

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-inner">
                    <div className="page-header">
                        <h1>Welcome, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></h1>
                        <p className="page-subtitle">Your BidderOS workspace is ready</p>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.12)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Resumes</span>
                                <span className="stat-value">{resumes?.length ?? 0}</span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.12)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Member since</span>
                                <span className="stat-value">
                                    {user?.created_at
                                        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                        : '—'}
                                </span>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.12)' }}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round">
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

                    <div className="card">
                        <p className="card-title">Account Details</p>
                        <div className="info-table">
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
                </div>
            </main>
        </div>
    );
}
