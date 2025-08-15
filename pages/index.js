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
  };

  return (
    <div className="container">
      <div className="logo-section">
        <img src="/safeshare-logo.png" alt="SafeShare" className="logo-image" />
        <p className="subtitle">Secure File Sharing with Legal Protection</p>
      </div>

      {!shareLink ? (
        <div>
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
                    <div>{file.name}</div>
                    <div>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <div>Click to select audio file</div>
                  </div>
                )}
              </label>
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="email-input"
            />

            {error && <div className="error-message">{error}</div>}

            <button 
              onClick={handleUpload} 
              disabled={!file || !email || uploading}
              className="upload-btn"
            >
              {uploading ? 'Uploading...' : 'Generate Secure Link'}
            </button>
          </div>
        </div>
      ) : (
        <div className="success-section">
          <h2>Success!</h2>
          <p>Your secure link:</p>
          <div className="link-box">
            <input 
              type="text" 
              value={shareLink} 
              readOnly 
              className="link-input"
            />
            <button onClick={copyToClipboard} className="copy-btn">Copy</button>
          </div>
          <button onClick={resetForm} className="new-upload-btn">
            Upload Another File
          </button>
        </div>
      )}

      <div className="footer">
        <p>Powered by <strong>Epiphany India</strong></p>
      </div>
    </div>
  );
}