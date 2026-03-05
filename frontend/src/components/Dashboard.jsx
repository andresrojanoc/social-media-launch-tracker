import React, { useState, useEffect } from 'react';
import companyService from '../services/companyService.js';
import CompanyCard from './CompanyCard.jsx';
import '../css/Dashboard.css';

export default function Dashboard() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        companyService.fetchCompanies()
            .then(data => {
                setCompanies(data.results ?? data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="dashboard-state">
            <div className="spinner" />
            <p>Loading dashboard...</p>
        </div>
    );

    if (error) return (
        <div className="dashboard-state error">
            <p>⚠️ {error}</p>
            <p className="hint">Make sure the Django backend is running on http://127.0.0.1:8000</p>
        </div>
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>🚀 Launch Tracker</h1>
                <p className="subtitle">Monitor company launches, fundraises & engagement</p>
            </header>

            {companies.length === 0 ? (
                <div className="dashboard-state">
                    <p>No companies found. Add some data to get started.</p>
                </div>
            ) : (
                <div className="company-grid">
                    {companies.map(company => (
                        <CompanyCard key={company.id} company={company} />
                    ))}
                </div>
            )}
        </div>
    );
}
