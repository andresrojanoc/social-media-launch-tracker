import React, { useState } from 'react';
import ContactBox from './ContactBox.jsx';
import DMDraftPrompt from './DMDraftPrompt.jsx';
import '../css/CompanyCard.css';

function formatRaised(amount) {
    if (!amount) return 'N/A';
    const num = parseFloat(amount);
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
    return `$${num}`;
}

function PlatformBadge({ platform }) {
    const icons = { X: '𝕏', LinkedIn: 'in', Crunchbase: '☆' };
    return (
        <span className={`platform-badge platform-${platform.toLowerCase()}`}>
            {icons[platform] || platform} {platform}
        </span>
    );
}

export default function CompanyCard({ company }) {
    const poorLaunches = company.launches?.filter(l => l.engagement_status === 'Poor') || [];

    return (
        <article className="company-card card">
            {/* Header */}
            <div className="card-header">
                <h2 className="company-name">{company.name}</h2>
                <div className="raised-badge">
                    <span className="raised-label">Total Raised</span>
                    <span className="raised-value">{formatRaised(company.amount_raised)}</span>
                </div>
            </div>

            {/* Launch Events */}
            <div className="launches-section">
                <h3>Launch Events</h3>
                {company.launches?.length > 0 ? (
                    <div className="launches-list">
                        {company.launches.map(launch => (
                            <div
                                key={launch.id}
                                className={`launch-row ${launch.engagement_status === 'Poor' ? 'poor' : 'good'}`}
                            >
                                <PlatformBadge platform={launch.platform} />
                                <div className="launch-metrics">
                                    <span className="metric">
                                        ❤️ <strong>{launch.likes_count.toLocaleString()}</strong> likes
                                    </span>
                                    <span className={`status-tag ${launch.engagement_status.toLowerCase()}`}>
                                        {launch.engagement_status}
                                    </span>
                                </div>
                                {launch.video_url && (
                                    <a href={launch.video_url} target="_blank" rel="noreferrer" className="video-link">
                                        View →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-state">No launch events recorded.</p>
                )}
            </div>

            {/* Contact Info (US2) */}
            {company.contact_info && <ContactBox contact={company.contact_info} />}

            {/* DM Draft (US3) */}
            {poorLaunches.length > 0 && (
                <DMDraftPrompt companyId={company.id} companyName={company.name} />
            )}
        </article>
    );
}
