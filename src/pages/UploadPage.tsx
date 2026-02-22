import { useState } from 'react';
import { useResumesQuery, useUploadResumeMutation } from '../store/authApi';
import { useNavigate } from 'react-router-dom';

export default function UploadPage() {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { data: resumes, isLoading: isLoadingResumes, refetch } = useResumesQuery();
    const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles(Array.from(e.target.files));
        }
    };

    const handleSubmit = async () => {
        if (selectedFiles.length === 0) return;

        setSuccessMessage('');
        setErrorMessage('');

        try {
            const formData = new FormData();
            selectedFiles.forEach(file => formData.append('files[]', file));

            const result = await uploadResume(formData).unwrap();
            setSuccessMessage(result.message);
            setSelectedFiles([]);
            refetch();
        } catch (err: unknown) {
            const error = err as { data?: { error?: string } };
            setErrorMessage(error?.data?.error || 'Upload failed. Try again.');
        }
    };

    return (
        <div className="upload-page">
            <header className="dashboard-header">
                <button onClick={() => navigate('/')} className="logout-button">
                    ← Back
                </button>
            </header>

            <main className="dashboard-content">
                <div className="welcome-section">
                    <h1>Upload <span className="gradient-text">Resumes</span></h1>
                    <p className="welcome-subtitle">Upload PDF or Word files to process</p>
                </div>

                <div className="info-card">
                    <h2>Select Files</h2>

                    <div className="upload-area">
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-input" className="upload-label">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span>Click to select files</span>
                            <span className="upload-hint">PDF, DOC, DOCX</span>
                        </label>

                        {selectedFiles.length > 0 && (
                            <ul className="file-list">
                                {selectedFiles.map((file, i) => (
                                    <li key={i} className="file-item">
                                        <span>{file.name}</span>
                                        <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {successMessage && <p className="upload-success">{successMessage}</p>}
                    {errorMessage && <p className="upload-error">{errorMessage}</p>}

                    <button
                        className="auth-button"
                        onClick={handleSubmit}
                        disabled={isUploading || selectedFiles.length === 0}
                        style={{ marginTop: '1rem' }}
                    >
                        {isUploading ? <span className="btn-spinner" /> : 'Upload'}
                    </button>
                </div>

                <div className="info-card" style={{ marginTop: '1.5rem' }}>
                    <h2>Uploaded Resumes</h2>
                    {isLoadingResumes ? (
                        <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
                    ) : resumes && resumes.length > 0 ? (
                        <div className="info-grid">
                            {resumes.map(r => (
                                <div key={r.id} className="info-row">
                                    <span className="info-label">{r.filename}</span>
                                    <span className="info-value">
                                        {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)' }}>No resumes uploaded yet.</p>
                    )}
                </div>
            </main>
        </div>
    );
}