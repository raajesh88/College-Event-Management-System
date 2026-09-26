import React, { useState } from 'react';
import CapybaraLoader from './CapybaraLoader';
import { LogOut, X } from 'lucide-react';

/**
 * Cyber-Themed Logout Confirmation Modal
 * Uses the exact Uiverse.io clipped cyber form theme with electric lime (#caf438)
 */
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoggingOut(true);
    // Small timeout to show CapybaraLoader gracefully before redirecting
    setTimeout(() => {
      onConfirm();
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="form-container"
        style={{ margin: 'auto', maxWidth: '480px', position: 'relative' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#8b2500',
            cursor: 'pointer',
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="form text-center">
          <div className="mb-2">
            <span className="inst-badge" style={{ fontSize: '0.72rem', letterSpacing: '0.08em' }}>
              COLLEGE EVENT SYSTEM
            </span>
          </div>

          <h2 className="c1" style={{ fontSize: '1.85rem', marginBottom: '0.35rem' }}>
            Sign Out
          </h2>
          <p className="c2" style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: '#5c4c3e' }}>
            Are you sure you want to sign out? Your registered events and passes are safely saved.
          </p>

          {loggingOut ? (
            <div style={{ padding: '1rem 0' }}>
              <CapybaraLoader message="Signing you out..." />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handleConfirm}
                className="btn btn-primary auth-signout-btn"
                data-auth="signout"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
