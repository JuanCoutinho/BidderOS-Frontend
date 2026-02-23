import { useResumesQuery } from '../store/authApi';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function ResumesPage() {
    const navigate = useNavigate();
    const { data: resumes, isLoading } = useResumesQuery();

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-inner">
                    <div className="page-header">
                        <h1>My <span className="gradient-text">Resumes</span></h1>
                        <p className="page-subtitle">All uploaded resumes for your account</p>
                    </div>

                    <div className="card">
                        <p className="card-title">Resume List</p>

                        {isLoading && <p className="empty-state">Loading...</p>}

                        {!isLoading && (!resumes || resumes.length === 0) && (
                            <p className="empty-state">
                                No resumes uploaded yet.{' '}
                                <button
                                    onClick={() => navigate('/upload')}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 'inherit' }}
                                >
                                    Upload one →
                                </button>
                            </p>
                        )}

                        {!isLoading && resumes && resumes.length > 0 && resumes.map(resume => (
                            <div key={resume.id} className="resume-item">
                                <div className="resume-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                    </svg>
                                </div>
                                <span className="resume-name">{resume.filename}</span>
                                <span className="resume-date">
                                    {new Date(resume.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}