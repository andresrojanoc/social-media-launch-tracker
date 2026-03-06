import React, { useState } from 'react';
import companyService from '../services/companyService.js';
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

function CompanyThumbnail({ thumbnailUrl, name }) {
    const [imgError, setImgError] = useState(false);

    if (!thumbnailUrl || imgError) {
        // Fallback: colored initials avatar
        const initials = name
            .split(' ')
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
        return (
            <div className="company-thumbnail placeholder" aria-label={name}>
                {initials}
            </div>
        );
    }

    return (
        <img
            src={thumbnailUrl}
            alt={`${name} thumbnail`}
            className="company-thumbnail"
            onError={() => setImgError(true)}
        />
    );
}

export default function CompanyCard({ company, onDelete }) {
    const [deleting, setDeleting] = useState(false);
    const poorLaunches = company.launches?.filter(l => l.engagement_status === 'Poor') || [];

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete ${company.name}?`)) return;

        setDeleting(true);
        try {
            await companyService.deleteCompany(company.id);
            if (onDelete) onDelete();
        } catch (error) {
            alert('Failed to delete company. Please try again.');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <article className={`company-card card ${deleting ? 'deleting' : ''}`}>
            <button
                className="delete-card-button"
                onClick={handleDelete}
                disabled={deleting}
                title="Delete Company"
            >
                {deleting ? '...' : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                )}
            </button>
            {/* Thumbnail + Header */}
            <div className="card-header">
                <CompanyThumbnail
                    thumbnailUrl={company.thumbnail_url}
                    name={company.name}
                />
                <div className="card-title-group">
                    <h2 className="company-name">{company.name}</h2>
                    {company.description && (
                        <p className="company-description">{company.description}</p>
                    )}
                </div>
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
            <DMDraftPrompt companyId={company.id} companyName={company.name} />
        </article>
    );
}
