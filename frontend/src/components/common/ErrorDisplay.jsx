import React from 'react';
import '../../css/ErrorDisplay.css';

/**
 * Reusable component for displaying API or application errors.
 */
const ErrorDisplay = ({ message, onRetry, status, details }) => {
    return (
        <div className="error-overlay">
            <div className="error-display">
                <span className="error-icon" role="img" aria-label="error">
                    {status === 0 ? '🔌' : '⚠️'}
                </span>
                <h3>{status === 0 ? 'Connection Error' : 'Something went wrong'}</h3>
                <p>{message || 'An unexpected error occurred. Please try again later.'}</p>

                {details && (
                    <div className="error-details">
                        <pre>{JSON.stringify(details, null, 2)}</pre>
                    </div>
                )}

                {onRetry && (
                    <button className="btn-retry" onClick={onRetry}>
                        🔄 Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default ErrorDisplay;
