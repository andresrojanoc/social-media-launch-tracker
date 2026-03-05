import React, { useState } from 'react';
import { apiClient } from '../utils/api.js';
import '../css/DMDraftPrompt.css';

export default function DMDraftPrompt({ companyId, companyName }) {
    const [platform, setPlatform] = useState('X');
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    const generateDraft = async () => {
        setLoading(true);
        setDraft(null);
        setError(null);
        try {
            const data = await apiClient.post(`/companies/${companyId}/draft_dm/`, { platform });
            setDraft(data.draft_text);
        } catch (err) {
            setError('Failed to generate draft. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(draft);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="dm-draft-prompt">
            <h3>✉️ Draft Outreach DM</h3>
            <p className="dm-subtitle">
                This launch had low engagement. Draft a personal outreach message to offer your services.
            </p>

            <div className="dm-controls">
                <label htmlFor={`platform-${companyId}`}>Platform:</label>
                <select
                    id={`platform-${companyId}`}
                    value={platform}
                    onChange={e => setPlatform(e.target.value)}
                >
                    <option value="X">𝕏 X / Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                </select>
                <button className="btn-generate" onClick={generateDraft} disabled={loading}>
                    {loading ? 'Generating…' : '⚡ Generate DM'}
                </button>
            </div>

            {error && <p className="dm-error">{error}</p>}

            {draft && (
                <div className="dm-result">
                    <textarea className="dm-text" readOnly value={draft} rows={5} />
                    <button className="btn-copy" onClick={copyToClipboard}>
                        {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
                    </button>
                </div>
            )}
        </div>
    );
}
