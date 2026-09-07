import React, { useState, useEffect } from 'react';
import { Download, CheckCircle, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const InstallAppButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowInstructions(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Installation prompt error:', err);
      }
    } else {
      // Fallback instructions for iOS or desktop where beforeinstallprompt isn't emitted
      setShowInstructions(true);
    }
  };

  if (isInstalled) {
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          padding: '6px 14px',
          borderRadius: '20px',
          color: '#10b981',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.5px',
        }}
      >
        <CheckCircle size={14} />
        <span>APP INSTALLED</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install Reality to Play as a standalone desktop or mobile application"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(79, 172, 254, 0.1) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.6)',
          padding: '8px 16px',
          borderRadius: '24px',
          color: '#00f2fe',
          fontFamily: '"Chakra Petch", sans-serif',
          fontSize: '12px',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.25)',
          transition: 'all 0.2s ease',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.borderColor = '#00f2fe';
          e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 242, 254, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.6)';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 242, 254, 0.25)';
        }}
      >
        <Download size={14} />
        <span>INSTALL APP</span>
      </button>

      {/* Instructional popover when direct prompt is unavailable */}
      {showInstructions && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 9, 18, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
          onClick={() => setShowInstructions(false)}
        >
          <div
            style={{
              background: '#0e1424',
              border: '2px solid #00f2fe',
              borderRadius: '20px',
              padding: '24px',
              maxWidth: '420px',
              width: '100%',
              boxShadow: '0 10px 40px rgba(0, 242, 254, 0.3)',
              color: '#ffffff',
              fontFamily: '"Chakra Petch", sans-serif',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInstructions(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Smartphone size={24} color="#00f2fe" />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#00f2fe' }}>
                INSTALL APP TO DEVICE
              </h3>
            </div>

            {isIOS ? (
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                <p>To install on your iPhone or iPad:</p>
                <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>
                  <li>Tap the <strong>Share</strong> button (box with arrow) in Safari.</li>
                  <li>Scroll down and select <strong>"Add to Home Screen" ➕</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top-right corner.</li>
                </ol>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>
                  The game will launch as a full-screen standalone application with offline support!
                </p>
              </div>
            ) : (
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#cbd5e1' }}>
                <p>To install on your browser or device:</p>
                <ol style={{ paddingLeft: '20px', margin: '10px 0' }}>
                  <li>Look for the <strong>Install icon 💻</strong> in your browser address bar (top-right).</li>
                  <li>Click <strong>Install Reality to Play</strong>.</li>
                  <li>Enjoy offline play with fast instant loading!</li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowInstructions(false)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '10px',
                background: 'linear-gradient(90deg, #00f2fe, #4facfe)',
                border: 'none',
                borderRadius: '12px',
                color: '#070912',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              GOT IT!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

