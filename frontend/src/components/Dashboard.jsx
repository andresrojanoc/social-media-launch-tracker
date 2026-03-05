import React, { useState, useEffect, useCallback } from 'react';
import companyService from '../services/companyService.js';
import CompanyCard from './CompanyCard.jsx';
import ErrorDisplay from './common/ErrorDisplay.jsx';
import '../css/Dashboard.css';

export default function Dashboard() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await companyService.fetchCompanies();
            setCompanies(data.results ?? data);
        } catch (err) {
            setError({
                message: err.message,
                status: err.status,
                details: err.data
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return (
        <div className="dashboard-state">
            <div className="spinner" />
            <p>Loading dashboard...</p>
        </div>
    );

    if (error) return (
        <ErrorDisplay
            message={error.message}
            status={error.status}
            details={error.details}
            onRetry={fetchData}
        />
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
