import { useState } from 'react';
import { useRecommendationsMutation, useGenerateCoverLetterMutation } from '../store/authApi';
import Sidebar from '../components/Sidebar';

export default function RecommendationsPage() {
    const [jobDescription, setJobDescription] = useState('');
    const [getRecommendations, { data, isLoading, error }] = useRecommendationsMutation();
    const [generateCoverLetter, { isLoading: isGenerating }] = useGenerateCoverLetterMutation();

    // UI States
    const [activeLetterId, setActiveLetterId] = useState<number | null>(null);
    const [letters, setLetters] = useState<Record<number, string>>({});

    const handleSubmit = async () => {
        if (!jobDescription.trim()) return;
        setLetters({}); // reset old letters
        setActiveLetterId(null);
        await getRecommendations({ job_description: jobDescription });
    };

    const handleGenerateLetter = async (resumeId: number) => {
        if (letters[resumeId]) {
            // Se já gerou apenas visualiza
            setActiveLetterId(activeLetterId === resumeId ? null : resumeId);
            return;
        }

        try {
            const result = await generateCoverLetter({ resume_id: resumeId, job_description: jobDescription }).unwrap();
            setLetters(prev => ({ ...prev, [resumeId]: result.cover_letter }));
            setActiveLetterId(resumeId);
        } catch (err: any) {
            const msg = err.data?.error || "Failed to generate cover letter.";
            alert(`Error: ${msg}`);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    const scoreColor = (score: number) => {
        if (score >= 75) return '#22c55e';
        if (score >= 50) return '#f59e0b';
        return '#6366f1';
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-inner">
                    <div className="page-header">
                        <h1>AI <span className="gradient-text">Recommendations</span></h1>
                        <p className="page-subtitle">Find the best matching resumes and generate Cover Letters instantly.</p>
                    </div>

                    <div className="card">
                        <p className="card-title">Job Description</p>
                        <div className="form-group">
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here... The AI will find the most relevant resumes and write tailored cover letters for you."
                                rows={7}
                            />
                        </div>
                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={isLoading || !jobDescription.trim()}
                            style={{ marginTop: '1rem', width: '100%' }}
                        >
                            {isLoading ? (
                                <><span className="btn-spinner" /> Analyzing...</>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                    Find Matches
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <p className="msg-error">Failed to get recommendations. Make sure you have resumes uploaded.</p>
                    )}

                    {data && (
                        <div className="card">
                            <p className="card-title">
                                {data.length > 0 ? `${data.length} match${data.length > 1 ? 'es' : ''} found` : 'No matches found'}
                            </p>

                            {data.length === 0 ? (
                                <p className="empty-state">No resumes matched. Try uploading more resumes.</p>
                            ) : (
                                <div className="rec-results">
                                    {data.map((rec, i) => (
                                        <div key={rec.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div className="rec-card" style={{ marginBottom: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                        background: 'rgba(99,102,241,0.12)', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center',
                                                        color: 'var(--accent)', flexShrink: 0,
                                                        fontWeight: 700, fontSize: '0.8rem'
                                                    }}>
                                                        #{i + 1}
                                                    </div>
                                                    <div className="rec-info">
                                                        <span className="rec-filename">{rec.filename}</span>
                                                        <span className="rec-date">
                                                            {new Date(rec.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                                    <button
                                                        onClick={() => handleGenerateLetter(rec.id)}
                                                        disabled={isGenerating}
                                                        className="btn-outline-glow"
                                                    >
                                                        {isGenerating && activeLetterId === rec.id ? (
                                                            <><span className="btn-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: 'rgba(167, 139, 250, 0.3)', borderTopColor: '#a78bfa' }} /> Generating...</>
                                                        ) : (
                                                            <>
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                                </svg>
                                                                {letters[rec.id] ? (activeLetterId === rec.id ? 'Hide Letter' : 'View Letter') : 'Write Letter'}
                                                            </>
                                                        )}
                                                    </button>

                                                    <div className="rec-score">
                                                        <span className="score-value" style={{ color: scoreColor(rec.score) }}>
                                                            {rec.score}%
                                                        </span>
                                                        <div className="score-bar">
                                                            <div className="score-fill" style={{ width: `${rec.score}%` }} />
                                                        </div>
                                                        <span className="score-label">match</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Cover Letter View */}
                                            {letters[rec.id] && activeLetterId === rec.id && (
                                                <div className="cover-letter-view">
                                                    <div className="cover-letter-header">
                                                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>AI GENERATED COVER LETTER</span>
                                                        <button className="copy-btn" onClick={() => copyToClipboard(letters[rec.id])}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                                            Copy Text
                                                        </button>
                                                    </div>
                                                    <div className="cover-letter-content">
                                                        {letters[rec.id].split('\n').map((paragraph, idx) => (
                                                            // eslint-disable-next-line react/no-array-index-key
                                                            <p key={idx}>{paragraph}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
