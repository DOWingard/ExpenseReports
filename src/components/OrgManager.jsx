import React, { useState } from 'react';
import useStore from '../store';
import { Plus, Home, Trash2, ArrowRight, AlertTriangle } from 'lucide-react';

const OrgManager = ({ onAddNew }) => {
    const { organizations, setActiveOrg, removeOrganization } = useStore();
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setDeleteConfirmId(id);
    };

    const confirmDelete = () => {
        if (deleteConfirmId) {
            removeOrganization(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    return (
        <div className="container" style={{ marginTop: '10vh', maxWidth: '600px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Organizations</h1>
                <p style={{ color: '#666' }}>Select an organization to manage or create a new one.</p>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {organizations.map(org => (
                    <div
                        key={org.id}
                        className="card"
                        onClick={() => setActiveOrg(org.id)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            padding: '1.5rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'var(--shadow)';
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '8px',
                                background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--primary)'
                            }}>
                                <Home size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{org.companyName}</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>{org.reportFrequency} Reports</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                onClick={(e) => handleDeleteClick(e, org.id)}
                                style={{
                                    background: 'none', border: 'none', color: '#ff4d4d',
                                    cursor: 'pointer', padding: '8px', borderRadius: '4px'
                                }}
                                title="Delete Organization"
                            >
                                <Trash2 size={18} />
                            </button>
                            <ArrowRight size={20} color="var(--primary)" />
                        </div>
                    </div>
                ))}

                <button
                    className="card"
                    onClick={onAddNew}
                    style={{
                        border: '2px dashed #ddd',
                        background: 'none',
                        boxShadow: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        padding: '1.5rem',
                        color: '#666'
                    }}
                >
                    <Plus size={20} />
                    <span>Create New Organization</span>
                </button>
            </div>

            {deleteConfirmId && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
                        <h2 className="modal-title">Confirm Deletion</h2>
                        <p className="modal-text">
                            Are you sure you want to delete this organization? <br />
                            <strong>This action is permanent and cannot be undone.</strong>
                        </p>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteConfirmId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ background: 'var(--danger)' }}
                                onClick={confirmDelete}
                            >
                                Delete Permanent
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrgManager;
