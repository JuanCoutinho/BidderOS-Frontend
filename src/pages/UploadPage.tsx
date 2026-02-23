import { useState } from 'react';
import { useResumesQuery, useUploadResumeMutation } from '../store/authApi';
import Sidebar from '../components/Sidebar';

export default function UploadPage() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [fileErrors, setFileErrors] = useState<{ file: string; reason: string }[]>([]);

    const { data: resumes, isLoading: isLoadingResumes, refetch } = useResumesQuery();
    const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async () => {
        if (selectedFiles.length === 0) return;
        setSuccessMessage('');
        setErrorMessage('');
        setFileErrors([]);

        try {
            const formData = new FormData();
            selectedFiles.forEach(file => formData.append('files[]', file));
            const result = await uploadResume(formData).unwrap();
            setSuccessMessage(result.message);
            if (result.errors && result.errors.length > 0) {
                setFileErrors(result.errors);
            }
            setSelectedFiles([]);
            refetch();
        } catch (err: unknown) {
            const error = err as { status?: number; data?: { error?: string; errors?: { file: string; reason: string }[] } };
            if (error?.data?.errors && error.data.errors.length > 0) {
                setFileErrors(error.data.errors);
                setErrorMessage(error?.data?.error || 'Some files failed to process.');
            } else {
                setErrorMessage(error?.data?.error || 'Upload failed. Please try again.');
            }
        }
    };

    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">
                <div className="page-inner">
                    <div className="page-header">
                        <h1>Upload <span className="gradient-text">Resumes</span></h1>
                        <p className="page-subtitle">Upload PDF or DOCX files to process and index</p>
                    </div>

                    <div className="card">
                        <p className="card-title">Select Files</p>

                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-input" className="upload-zone">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <span className="upload-zone-title">Click to select files</span>
                            <span className="upload-zone-hint">PDF and DOCX supported</span>
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

                        {successMessage && <p className="msg-success">{successMessage}</p>}
                        {errorMessage && <p className="msg-error">{errorMessage}</p>}

                        {fileErrors.length > 0 && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    FILE ERRORS
                                </p>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {fileErrors.map((fe, i) => (
                                        <li key={i} className="msg-error" style={{ fontSize: '0.82rem', padding: '8px 12px', borderRadius: '8px' }}>
                                            <strong>{fe.file}:</strong> {fe.reason}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            className="btn-primary"
                            onClick={handleSubmit}
                            disabled={isUploading || selectedFiles.length === 0}
                            style={{ marginTop: '1.25rem', width: '100%' }}
                        >
                            {isUploading ? <span className="btn-spinner" /> : 'Upload & Process'}
                        </button>
                    </div>

                    <div className="card">
                        <p className="card-title">Uploaded Resumes</p>
                        {isLoadingResumes ? (
                            <p className="empty-state">Loading...</p>
                        ) : resumes && resumes.length > 0 ? (
                            resumes.map(r => (
                                <div key={r.id} className="resume-item">
                                    <div className="resume-icon">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                    </div>
                                    <span className="resume-name">{r.filename}</span>
                                    <span className="resume-date">
                                        {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state">No resumes uploaded yet.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}