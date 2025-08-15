<!DOCTYPE html>
<html>
<head>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
  background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 680px;
  width: 100%;
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 28px;
  border-bottom: 2px solid #E5E5E5;
}

.logo-image {
  max-width: 280px;
  height: auto;
  margin-bottom: 12px;
}

.subtitle {
  color: #6B6B6B;
  font-size: 15px;
  letter-spacing: 0.3px;
}

.info-section {
  background: linear-gradient(135deg, #FDFBF7 0%, #FFF9E6 100%);
  border: 1px solid #F0E6D2;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
}

.info-section h3 {
  color: #2C2C2C;
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 600;
}

.info-section p {
  color: #6B6B6B;
  font-size: 14px;
  margin-bottom: 20px;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  background: white;
  border-radius: 8px;
}

.feature-icon {
  font-size: 24px;
}

.feature-text {
  font-size: 14px;
  color: #2C2C2C;
  font-weight: 500;
}

.terms-preview-section {
  text-align: center;
  margin-bottom: 24px;
}

.terms-preview-btn {
  background: transparent;
  color: #B8941F;
  border: 2px solid #D4AF37;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
}

.terms-preview-btn:hover {
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  color: white;
}

.upload-box {
  border: 3px dashed #E5E5E5;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  background: #FAFAFA;
  margin-bottom: 28px;
  cursor: pointer;
  transition: all 0.3s;
}

.upload-box:hover {
  border-color: #D4AF37;
  background: #FFFEF5;
}

.email-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #E5E5E5;
  border-radius: 10px;
  font-size: 16px;
  margin-bottom: 20px;
}

.email-input:focus {
  outline: none;
  border-color: #D4AF37;
}

.upload-btn {
  width: 100%;
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  color: white;
  border: none;
  padding: 16px 28px;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 32px;
}

.upload-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(212, 175, 55, 0.4);
}

.upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.how-it-works {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 2px solid #E5E5E5;
}

.how-it-works h4 {
  color: #2C2C2C;
  font-size: 18px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 600;
}

.steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.step-text {
  font-size: 13px;
  color: #6B6B6B;
  text-align: center;
  max-width: 100px;
}

.step-arrow {
  color: #E5E5E5;
  font-size: 20px;
  margin: 0 -10px;
}

.footer {
  margin-top: 48px;
  padding-top: 28px;
  border-top: 2px solid #E5E5E5;
  text-align: center;
}

.powered-by {
  color: #6B6B6B;
  font-size: 13px;
  margin-bottom: 10px;
}

.footer-links {
  margin-top: 10px;
}

.footer-links a {
  color: #B8941F;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  margin: 0 10px;
}
</style>
</head>
<body>

<div class="container">
  <!-- Logo Section -->
  <div class="logo-section">
    <img src="/safeshare-logo.png" alt="SafeShare" class="logo-image" />
    <p class="subtitle">Secure File Sharing with Legal Protection</p>
  </div>

  <!-- Info Section -->
  <div class="info-section">
    <h3>Protect Your Creative Work</h3>
    <p>
      Share your audio files securely with automatic legal protection. 
      Recipients must accept binding terms before downloading.
    </p>
    <div class="features-grid">
      <div class="feature">
        <div class="feature-icon">🛡️</div>
        <span class="feature-text">Terms Protected</span>
      </div>
      <div class="feature">
        <div class="feature-icon">📧</div>
        <span class="feature-text">Download Alerts</span>
      </div>
      <div class="feature">
        <div class="feature-icon">🗑️</div>
        <span class="feature-text">Auto-Delete</span>
      </div>
      <div class="feature">
        <div class="feature-icon">🔗</div>
        <span class="feature-text">Short Links</span>
      </div>
    </div>
  </div>

  <!-- Terms Preview Button -->
  <div class="terms-preview-section">
    <button class="terms-preview-btn">👁 View Standard Terms</button>
  </div>

  <!-- Upload Section -->
  <div class="upload-section">
    <div class="upload-box">
      <div class="upload-icon" style="font-size: 56px; margin-bottom: 16px;">☁️</div>
      <div style="font-size: 20px; color: #2C2C2C; font-weight: 600; margin-bottom: 8px;">
        Drop Your Audio File Here
      </div>
      <div style="font-size: 14px; color: #6B6B6B;">
        or click to browse<br/>
        <span style="font-size: 12px; color: #7A7A7A;">MP3, WAV, M4A, FLAC (Max 100MB)</span>
      </div>
    </div>

    <div style="margin-bottom: 28px;">
      <label style="display: block; margin-bottom: 10px; color: #2C2C2C; font-size: 15px; font-weight: 600;">
        Your Email <span style="color: #D4AF37;">*</span>
      </label>
      <input type="email" placeholder="you@example.com" class="email-input" />
      <p style="font-size: 13px; color: #6B6B6B; margin-top: 8px;">
        Get instant notification when your file is downloaded
      </p>
    </div>

    <button class="upload-btn">
      🚀 Generate Protected Link
    </button>

    <!-- How It Works -->
    <div class="how-it-works">
      <h4>How SafeShare Works</h4>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <span class="step-text">Upload your file</span>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">2</div>
          <span class="step-text">Get secure link</span>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">3</div>
          <span class="step-text">Share with clients</span>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">4</div>
          <span class="step-text">Protected download</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p class="powered-by">Powered by <strong>Epiphany India</strong></p>
    <div class="footer-links">
      <a href="https://www.epiphanyindia.com/vaanisafe">Watermark Audio</a>
      <span style="color: #6B6B6B;">•</span>
      <a href="#">Go Pro</a>
    </div>
  </div>
</div>

</body>
</html>