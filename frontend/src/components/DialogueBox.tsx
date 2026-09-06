import React from 'react';
import { MessageSquare, Check } from 'lucide-react';

interface DialogueBoxProps {
  title: string;
  text: string;
  onDismiss: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ title, text, onDismiss }) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '620px',
      background: 'rgba(15, 23, 42, 0.95)',
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
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
          Press [E] or Space to close
        </span>
      </div>

      <p style={{
        fontSize: '15px',
        lineHeight: '1.5',
        color: '#f8fafc',
        margin: '0 0 12px 0',
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
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.1s, background 0.2s',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Check size={14} /> Continue
        </button>
      </div>
    </div>
  );
};
