import { useResumesQuery } from '../store/authApi';
import { useNavigate } from 'react-router-dom';

export default function ResumesPage() {
    const navigate = useNavigate();
    const { data: resumes, isLoading } = useResumesQuery();

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <button onClick={() => navigate('/')} className="logout-button">← Back</button>
            </header>

            <main className="dashboard-content">
                <div className="welcome-section">
                    <h1>My <span className="gradient-text">Resumes</span></h1>
                    <p className="welcome-subtitle">All uploaded resumes for your account</p>
                </div>

                <div className="info-card">
                    <h2>Resume List</h2>

                    {isLoading && (
                        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                    )}

                    {!isLoading && (!resumes || resumes.length === 0) && (
                        <p style={{ color: 'var(--text-muted)' }}>
                            No resumes uploaded yet. <button
                                onClick={() => navigate('/upload')}
                                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: 'inherit' }}
                            >Upload one →</button>
                        </p>
                    )}

                    {!isLoading && resumes && resumes.length > 0 && (
                        <div className="info-grid">
                            {resumes.map(resume => (
                                <div key={resume.id} className="info-row">
                                    <span className="info-label">{resume.filename}</span>
                                    <span className="info-value">
                                        {new Date(resume.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}