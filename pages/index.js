import { useState } from 'react';

export default function Home() {
  const [showTermsPreview, setShowTermsPreview] = useState(false);

  return (
    <div className="container">
      {/* Logo Section */}
      <div className="logo-section">
        <img src="/safeshare-logo.png" alt="SafeShare" className="logo-image" />
        <p className="subtitle">Secure File Sharing with Legal Protection</p>
      </div>

      {/* Info Section */}
      <div className="info-section">
        <h3>Protect Your Creative Work</h3>
        <p>
          Share your audio files securely with automatic legal protection. 
          Recipients must accept binding terms before downloading.
        </p>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">[Shield]</div>
            <span className="feature-text">Terms Protected</span>
          </div>
          <div className="feature">
            <div className="feature-icon">[Email]</div>
            <span className="feature-text">Download Alerts</span>
          </div>
          <div className="feature">
            <div className="feature-icon">[Delete]</div>
            <span className="feature-text">Auto-Delete</span>
          </div>
          <div className="feature">
            <div className="feature-icon">[Link]</div>
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
          {showTermsPreview ? 'Hide' : 'View'} Standard Terms
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

      {/* Upload Section Placeholder */}
      <div className="upload-section">
        <div className="upload-box">
          <div className="file-placeholder">
            <div className="upload-icon">[Cloud]</div>
            <div className="upload-title">Upload Feature Coming Soon</div>
            <div className="upload-hint">
              We'll add the upload functionality next
            </div>
          </div>
        </div>
      </div>

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