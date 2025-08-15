import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function DownloadPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showTerms, setShowTerms] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };

  const handleRejectTerms = () => {
    setError('You must accept the terms to download this file');
    setShowTerms(false);
  };

  const handleDownload = async () => {
    if (!termsAccepted) {
      setShowTerms(true);
      return;
    }

    setDownloading(true);
    setError('');
    
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shortId: id,
          termsAccepted: true
        })
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        // Create download link
        const link = document.createElement('a');
        link.href = data.url;
        link.download = data.filename || 'audio-file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setDownloadComplete(true);
        
        // Show success and redirect
        setTimeout(() => {
          alert('Download complete! This file has been deleted from our servers.');
          router.push('/');
        }, 3000);
      } else {
        setError(data.error || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      setError('Download failed. File may have expired.');
    }
    
    setDownloading(false);
  };

  // Simple Terms Modal Component
  const TermsModal = () => {
    if (!showTerms || termsAccepted) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflow: 'auto',
          margin: '20px'
        }}>
          <h2>Terms and Conditions</h2>
          <div style={{ margin: '20px 0', lineHeight: '1.6' }}>
            <h3>AUDIO FILE DOWNLOAD - TERMS OF USE</h3>
            <p>By downloading this file, you agree to these legally binding terms:</p>
            
            <h4>1. LICENSE GRANT</h4>
            <p>You receive a limited, non-exclusive, non-transferable license for personal evaluation only.</p>
            
            <h4>2. RESTRICTIONS</h4>
            <ul>
              <li>✗ No commercial use without payment</li>
              <li>✗ No redistribution or sharing</li>
              <li>✗ No modifications or derivative works</li>
              <li>✗ No AI/ML training or voice cloning</li>
              <li>✗ No dataset creation or data mining</li>
            </ul>
            
            <h4>3. INTELLECTUAL PROPERTY</h4>
            <p>All rights remain with the copyright holder.</p>
            
            <h4>4. DATA COLLECTION</h4>
            <p>Your IP address and download time are logged for security.</p>
            
            <h4>5. LIABILITY</h4>
            <p>Unauthorized use may result in legal action.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button 
              onClick={handleRejectTerms}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f0f0f0',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Decline
            </button>
            <button 
              onClick={handleAcceptTerms}
              style={{
                padding: '10px 20px',
                backgroundColor: '#D4AF37',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              I Accept
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <TermsModal />
      
      <div className="download-page" style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div className="logo-section">
          <img src="/safeshare-logo.png" alt="SafeShare" className="logo-image" />
          <p className="subtitle">Secure File Download</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '30px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <h1>🎵 Audio File Ready</h1>
          
          <div style={{ margin: '20px 0', color: '#666' }}>
            <p>Link ID: <strong>{id}</strong></p>
            <p style={{ fontSize: '14px', marginTop: '10px' }}>
              ⚠️ File will be deleted after download
            </p>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#ffebee',
              color: '#c62828',
              padding: '10px',
              borderRadius: '5px',
              margin: '20px 0'
            }}>
              {error}
            </div>
          )}

          {downloadComplete && (
            <div style={{
              backgroundColor: '#e8f5e9',
              color: '#2e7d32',
              padding: '10px',
              borderRadius: '5px',
              margin: '20px 0'
            }}>
              ✅ Download started! Check your downloads folder.
            </div>
          )}

          {!termsAccepted && (
            <div style={{
              backgroundColor: '#fff3cd',
              color: '#856404',
              padding: '15px',
              borderRadius: '5px',
              margin: '20px 0'
            }}>
              ⚠️ You must accept our terms and conditions to download this file
            </div>
          )}
          
          <button 
            onClick={handleDownload}
            disabled={downloading || downloadComplete}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: termsAccepted ? '#D4AF37' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: termsAccepted && !downloading && !downloadComplete ? 'pointer' : 'not-allowed',
              marginTop: '20px'
            }}
          >
            {downloading ? '⏳ Preparing Download...' : 
             downloadComplete ? '✅ Downloaded' : 
             '⬇️ Download Audio File'}
          </button>

          {termsAccepted && (
            <div style={{
              marginTop: '15px',
              color: '#4caf50',
              fontSize: '14px'
            }}>
              ✅ Terms & Conditions Accepted
            </div>
          )}
        </div>

        <div className="footer" style={{ marginTop: '40px', color: '#666', fontSize: '12px' }}>
          <p>Powered by <strong>Epiphany India</strong></p>
        </div>
      </div>
    </div>
  );
}