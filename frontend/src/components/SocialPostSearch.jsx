import React, { useState } from 'react';
import companyService from '../services/companyService.js';
import '../css/SocialPostSearch.css';

export default function SocialPostSearch({ onRefresh }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const isRandomString = (str) => {
        // Simple heuristic: if it has 3+ consecutive consonants or too many numbers/special chars
        if (str.length < 2) return true;
        const consonants = str.match(/[^aeiou\d\s\W]{3,}/i);
        const tooManyNumbers = (str.match(/\d/g) || []).length > str.length / 2;
        return !!consonants || tooManyNumbers;
    };

    const generateSVGLogo = (name) => {
        if (!name || name.length < 2 || isRandomString(name)) return null;
        const firstChar = name.charAt(0).toUpperCase();
        const colors = ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#ec4899'];
        const color = colors[name.length % colors.length];

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <rect width="100" height="100" rx="20" fill="${color}" />
                <text x="50" y="65" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle">${firstChar}</text>
            </svg>
        `.trim();

        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);
        setError('');

        const isX = url.includes('x.com') || url.includes('twitter.com');
        const isLinkedIn = url.includes('linkedin.com');

        if (!isX && !isLinkedIn) {
            setError('Invalid URL. Please provide a valid X (Twitter) or LinkedIn post URL.');
            setLoading(false);
            return;
        }

        setTimeout(() => {

            let username = 'Unknown';
            let platformName = 'Social Media';

            if (isX) {
                // Extract from status/id or profile
                const xMatch = url.match(/(?:x\.com|twitter\.com)\/([^\/]+)/);
                username = xMatch ? xMatch[1] : 'Unknown';
                platformName = 'X';
            } else if (isLinkedIn) {
                const liMatch = url.match(/linkedin\.com\/(?:in|posts|status)\/([^\/\?]+)/);
                username = liMatch ? liMatch[1] : 'User';
                platformName = 'LinkedIn';
            }

            const logo = generateSVGLogo(username);

            const mockData = {
                name: username,
                platform: platformName,
                id: url.split('/').pop()?.split('?')[0] || Math.random().toString(36).substr(2, 9),
                author: username,
                likes: Math.floor(Math.random() * 5000) + 100,
                content: `Extracted data from ${platformName} for user: ${username}`,
                logo_url: logo,
                profile_x: `https://x.com/${username}`,
                profile_linkedin: `https://www.linkedin.com/in/${username}`,
                url: url
            };

            setResult(mockData);
            setLoading(false);
        }, 1200);
    };

    const handleDiscard = () => {
        setResult(null);
        setUrl('');
    };

    const handleInclude = async () => {
        if (!result) return;
        setLoading(true);
        try {
            // Note: backend CompanyService.create_company_entry handles name/description
            await companyService.createCompany({
                name: result.name,
                description: result.content,
                logo_url: result.logo_url,
                url: result.url,
                platform: result.platform,
                likes: result.likes
            });
            handleDiscard();
            if (onRefresh) onRefresh();
        } catch (error) {
            alert('Failed to include company. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="social-search-container">
            <form className="search-bar-wrapper" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Paste X or LinkedIn post URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <button type="submit" className="search-button" disabled={loading || !url}>
                    {loading ? (
                        <div className="scraping-loader">
                            <div className="mini-spinner"></div>
                            <span>Parsing...</span>
                        </div>
                    ) : (
                        <>
                            <span>🔍</span>
                            <span>Analyze URL</span>
                        </>
                    )}
                </button>
            </form>

            {error && (
                <div className="search-error-message" style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    ⚠️ {error}
                </div>
            )}

            {result && (
                <div className="search-result-card card">
                    <div className="card-header">
                        {result.logo_url ? (
                            <img src={result.logo_url} alt="Logo" className="company-thumbnail" />
                        ) : (
                            <div className="company-thumbnail placeholder">
                                {result.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="card-title-group">
                            <h2 className="company-name">{result.name}</h2>
                            <p className="company-description">Platform: {result.platform}</p>
                        </div>
                    </div>

                    <div className="post-content-preview">
                        <strong>Extracted From:</strong> {result.url}
                    </div>

                    <div className="profile-links" style={{ display: 'flex', gap: '1rem', margin: '1rem 0', fontSize: '0.85rem' }}>
                        <a href={result.profile_x} target="_blank" rel="noreferrer" style={{ color: '#1d9bf0' }}>X Profile</a>
                        <a href={result.profile_linkedin} target="_blank" rel="noreferrer" style={{ color: '#0a66c2' }}>LinkedIn Profile</a>
                    </div>

                    <div className="result-metrics">
                        <div className="metric-item">
                            <span className="metric-label">Estimated Engagement</span>
                            <span className="metric-number">❤️ {result.likes.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="result-actions">
                        <button
                            className="include-button"
                            onClick={handleInclude}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : '✔ Include in Dashboard'}
                        </button>
                        <button
                            className="discard-button"
                            onClick={handleDiscard}
                            disabled={loading}
                        >
                            ✖ Discard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
