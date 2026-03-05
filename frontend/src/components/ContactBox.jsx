import React from 'react';
import '../css/ContactBox.css';

export default function ContactBox({ contact }) {
    if (!contact) return null;

    const items = [
        { icon: '📧', label: 'Email', value: contact.email, href: contact.email ? `mailto:${contact.email}` : null },
        { icon: '📞', label: 'Phone', value: contact.phone_number, href: contact.phone_number ? `tel:${contact.phone_number}` : null },
        { icon: 'in', label: 'LinkedIn', value: contact.linkedin_handle, href: contact.linkedin_handle ? `https://linkedin.com/in/${contact.linkedin_handle}` : null },
        { icon: '𝕏', label: 'X / Twitter', value: contact.x_handle, href: contact.x_handle ? `https://x.com/${contact.x_handle}` : null },
    ];

    const available = items.filter(i => i.value);

    return (
        <div className="contact-box">
            <h3>📇 Contact Methods</h3>
            {available.length === 0 ? (
                <p className="empty-state">No contact info available.</p>
            ) : (
                <ul className="contact-list">
                    {available.map(item => (
                        <li key={item.label} className="contact-item">
                            <span className="contact-icon">{item.icon}</span>
                            <span className="contact-label">{item.label}:</span>
                            {item.href ? (
                                <a href={item.href} target="_blank" rel="noreferrer" className="contact-value link">
                                    {item.value}
                                </a>
                            ) : (
                                <span className="contact-value">{item.value}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
