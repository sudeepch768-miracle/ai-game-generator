import React, { useEffect } from 'react';
import { MessageSquare, Check, X } from 'lucide-react';

interface DialogueBoxProps {
  title: string;
  text: string;
  onDismiss: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ title, text, onDismiss }) => {
  // Listen for E, Space, Enter, Escape to close dialogue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code.toLowerCase();
      const key = e.key.toLowerCase();
      if (
        code === 'keye' || key === 'e' ||
        code === 'space' || key === ' ' ||
        code === 'enter' || key === 'enter' ||
        code === 'escape' || key === 'escape'
      ) {
        e.preventDefault();
        e.stopPropagation();
        onDismiss();
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [onDismiss]);

  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '620px',
      background: 'rgba(15, 23, 42, 0.96)',
      backdropFilter: 'blur(12px)',
      border: '2px solid #8b5cf6',
      borderRadius: '16px',
      padding: '16px 20px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(139, 92, 246, 0.3)',
      color: '#ffffff',
      fontFamily: '"Chakra Petch", sans-serif',
      zIndex: 25,
      animation: 'slideUp 0.2s ease-out',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#4c1d95',
          color: '#e9d5ff',
          padding: '4px 12px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}>
          <MessageSquare size={14} />
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#a78bfa', fontWeight: 600 }}>
            Press <kbd style={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: '4px', padding: '1px 5px', color: '#fff' }}>E</kbd> or <kbd style={{ background: '#1e1b4b', border: '1px solid #7c3aed', borderRadius: '4px', padding: '1px 5px', color: '#fff' }}>Space</kbd> to close
          </span>
          <button
            onClick={onDismiss}
            aria-label="Close dialogue"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '6px',
              padding: '3px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <p style={{
        fontSize: '15px',
        lineHeight: '1.5',
        color: '#f8fafc',
        margin: '0 0 14px 0',
      }}>
        {text}
      </p>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onDismiss}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#8b5cf6',
            color: '#ffffff',
            border: 'none',
            padding: '7px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.1s, background 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Check size={14} /> Continue [E]
        </button>
      </div>
    </div>
  );
};
