import React, { useState } from 'react';
import '../css/SocialPostSearch.css';

export default function SocialPostSearch() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setResult(null);

        // Mock "Scraping" delay
        setTimeout(() => {
            const isX = url.includes('x.com') || url.includes('twitter.com');
            const isLinkedIn = url.includes('linkedin.com');

            let mockData = null;

            if (isX) {
                mockData = {
                    platform: 'X',
                    id: url.split('/').pop()?.split('?')[0] || '1929554635544461727',
                    author: '@startup_visionary',
                    likes: Math.floor(Math.random() * 5000) + 100,
                    retweets: Math.floor(Math.random() * 1000) + 20,
                    content: "Excited to finally share what we've been building for the last 18 months! 🚀 The future of AI collaboration is here. #launch #startup"
                };
            } else if (isLinkedIn) {
                mockData = {
                    platform: 'LinkedIn',
                    id: 'share_82736451920',
                    author: 'John Doe, CEO @ VentureStream',
                    likes: Math.floor(Math.random() * 2000) + 50,
                    comments: Math.floor(Math.random() * 300) + 15,
                    content: "Today marks a major milestone. We are officially opening our early access program. Thank you to the team for the incredible hard work! 💼✨"
                };
            } else {
                // Default fallback if URL doesn't match
                mockData = {
                    platform: 'Social Media',
                    id: 'unknown',
                    author: 'Post Author',
                    likes: 120,
                    content: "General post preview for the provided URL..."
                };
            }

            setResult(mockData);
            setLoading(false);
        }, 1500);
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
                            <span>Scraping...</span>
                        </div>
                    ) : (
                        <>
                            <span>🔍</span>
                            <span>Analyze Post</span>
                        </>
                    )}
                </button>
            </form>

            {result && (
                <div className="search-result-card card">
                    <div className="result-header">
                        <div className="platform-info">
                            <span>{result.platform === 'X' ? '𝕏' : 'in'}</span>
                            <span>{result.platform} Post Analysis</span>
                        </div>
                        <span className="post-id">ID: {result.id}</span>
                    </div>

                    <div className="author-name">
                        <strong>Author:</strong> {result.author}
                    </div>

                    <div className="post-content-preview">
                        "{result.content}"
                    </div>

                    <div className="result-metrics">
                        <div className="metric-item">
                            <span className="metric-label">Likes / Reactions</span>
                            <span className="metric-number">❤️ {result.likes.toLocaleString()}</span>
                        </div>
                        {result.retweets && (
                            <div className="metric-item">
                                <span className="metric-label">Retweets</span>
                                <span className="metric-number">🔁 {result.retweets.toLocaleString()}</span>
                            </div>
                        )}
                        {result.comments && (
                            <div className="metric-item">
                                <span className="metric-label">Comments</span>
                                <span className="metric-number">💬 {result.comments.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="metric-item">
                            <span className="metric-label">Engagement</span>
                            <span className="metric-number" style={{ color: result.likes > 100 ? 'var(--success-color)' : 'var(--warning-color)' }}>
                                {result.likes > 100 ? '🔥 High' : '⚖️ Normal'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
