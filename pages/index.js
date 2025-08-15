import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState('');
  const [showTermsPreview, setShowTermsPreview] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('audio/')) {
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError('File too large. Maximum size is 100MB.');
        return;
      }
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select an audio file');
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleUpload = async () => {
    if (!file || !email) {
      setError('Please select a file and enter your email');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setUploading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        const link = `${window.location.origin}/a/${data.code}`;
        setShareLink(link);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (error) {
      setError('Upload failed. Please try again.');
      console.error(error);
    }
    setUploading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert('Link copied to clipboard!');
  };

  const resetForm = () => {
    setFile(null);
    setEmail('');
    setShareLink('');
    setError('');
    setShowTermsPreview(false);
  };

  return (
    <div className="container">
      {/* Logo Section */}
      <div className="logo-section">
        <img src="/safeshare-logo.png" alt="SafeShare" className="logo-image" />
        <p className="subtitle">Secure File Sharing with Legal Protection</p>
      </div>

      {!shareLink ? (
        <>
          {/* Info Section */}
          <div className="info-section">
            <h3>Protect Your Creative Work</h3>
            <p>
              Share your audio files securely with automatic legal protection. 
              Recipients must accept binding terms before downloading.
            </p>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">🛡️</div>
                <span className="feature-text">Terms Protected</span>
              </div>
              <div className="feature">
                <div className="feature-icon">📧</div>
                <span className="feature-text">Download Alerts</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🗑️</div>
                <span className="feature-text">Auto-Delete</span>
              </div>
              <div className="feature">
                <div className="feature-icon">🔗</div>
                <span className="feature-text">Short Links</span>
              </div>
            </div>
          </div>

          {/* Terms Preview Button */}
          <div className="terms-preview-section">
            <button 
              className="terms-preview-btn"
              onClick={() => setShowTermsPreview(!showTermsPreview)}
            >
              {showTermsPreview ? '✖ Hide' : '👁 View'} Standard Terms
            </button>
          </div>

          {/* Terms Preview */}
          {showTermsPreview && (
            <div className="terms-preview">
              <h4>Recipients Must Agree To:</h4>
              <ul>
                <li>✓ Personal use only - no commercial exploitation</li>
                <li>✓ No redistribution or sharing with others</li>
                <li>✓ No modifications or derivative works</li>
                <li>✓ No AI/ML training or voice cloning</li>
                <li>✓ No dataset creation or data mining</li>
                <li>✓ Copyright remains with the original creator</li>
                <li>✓ Violation results in legal action</li>
                <li>✓ Download activity is logged and monitored</li>
                <li>✓ File access expires after download</li>
              </ul>
              <p className="terms-note">
                <strong>Coming Soon:</strong> Custom terms for Pro users
              </p>
            </div>
          )}

          {/* Upload Section */}
          <div className="upload-section">
            <div className="upload-box">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                id="file-input"
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="file-label">
                {file ? (
                  <div className="file-selected">
                    <div className="file-icon">🎵</div>
                    <div className="file-details">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <div className="upload-icon">☁️</div>
                    <div className="upload-title">Drop Your Audio File Here</div>
                    <div className="upload-hint">
                      or click to browse<br/>
                      <span className="file-types">MP3, WAV, M4A, FLAC (Max 100MB)</span>
                    </div>
                  </div>
                )}
              </label>
            </div>

            <div className="email-section">
              <label htmlFor="email" className="email-label">
                Your Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="email-input"
                required
              />
              <p className="email-hint">
                Get instant notification when your file is downloaded
              </p>
            </div>

            {error && (
              <div className="error-message">⚠️ {error}</div>
            )}

            {file && email && (
              <button 
                onClick={handleUpload} 
                disabled={uploading}
                className="upload-btn"
              >
                {uploading ? (
                  <span className="btn-content">
                    <span className="spinner"></span>
                    Creating Secure Link...
                  </span>
                ) : (
                  <span className="btn-content">
                    🚀 Generate Protected Link
                  </span>
                )}
              </button>
            )}

            {/* How It Works */}
            <div className="how-it-works">
              <h4>How SafeShare Works</h4>
              <div className="steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <span className="step-text">Upload your file</span>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">2</div>
                  <span className="step-text">Get secure link</span>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">3</div>
                  <span className="step-text">Share with clients</span>
                </div>
                <div className="step-arrow">→</div>
                <div className="step">
                  <div className="step-number">4</div>
                  <span className="step-text">Protected download</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Success Section */
        <div className="success-section">
          <div className="success-animation">
            <div className="success-icon">✅</div>
          </div>
          <h2>Your Protected Link is Ready!</h2>
          <p className="success-info">
            Your file is now legally protected and ready to share
          </p>
          
          <div className="link-section">
            <label className="link-label">Secure Share Link:</label>
            <div className="link-box">
              <input 
                type="text" 
                value={shareLink} 
                readOnly 
                className="link-input"
                onClick={(e) => e.target.select()}
              />
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copy
              </button>
            </div>
          </div>

          <div className="link-features">
            <div className="link-feature">
              <span className="check">✓</span> Legal terms protection active
            </div>
            <div className="link-feature">
              <span className="check">✓</span> Download tracking enabled
            </div>
            <div className="link-feature">
              <span className="check">✓</span> Auto-delete after download
            </div>
          </div>

          <div className="notification-info">
            📧 Notification will be sent to: <strong>{email}</strong>
          </div>

          <button onClick={resetForm} className="new-upload-btn">
            Share Another File
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <p className="powered-by">Powered by <strong>Epiphany India</strong></p>
          <div className="footer-links">
            <a href="https://www.epiphanyindia.com/vaanisafe" target="_blank" rel="noopener noreferrer">
              Watermark Audio
            </a>
            <span className="separator">•</span>
            <a href="#" onClick={(e) => {e.preventDefault(); alert('Pro features launching soon!')}}>
              Go Pro
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}