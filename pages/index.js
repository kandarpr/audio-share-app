import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState('');
  const [uploading, setUploading] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [error, setError] = useState('');

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
    formData.append('audio', file);
    formData.append('email', email);
    formData.append('filename', file.name);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const link = `${window.location.origin}/a/${response.data.shortId}`;
      setShareLink(link);
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
      <h1>🎵 Secure Audio Sharing</h1>
      <p className="subtitle">Share audio files with terms protection</p>
      
      {!shareLink ? (
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
                <div>
                  <div className="file-icon">📁</div>
                  <div className="file-name">{file.name}</div>
                  <div className="file-size">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              ) : (
                <div>
                  <div className="upload-icon">📂</div>
                  <div>Choose Audio File</div>
                  <div className="upload-hint">Max 100MB • MP3, WAV, etc.</div>
                </div>
              )}
            </label>
          </div>

          <div className="email-section">
            <label htmlFor="email" className="email-label">
              Your Email (for download notifications):
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="email-input"
              required
            />
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
                <span>⏳ Uploading... Please wait</span>
              ) : (
                <span>🚀 Upload & Generate Link</span>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="success-section">
          <div className="success-icon">✅</div>
          <h2>Upload Successful!</h2>
          <p className="success-info">
            Your file will be deleted after download or in 7 days
          </p>
          
          <div className="link-section">
            <label className="link-label">Share this short link:</label>
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

          <div className="notification-info">
            📧 You'll receive an email at <strong>{email}</strong> when someone downloads your file
          </div>

          <button onClick={resetForm} className="new-upload-btn">
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
}