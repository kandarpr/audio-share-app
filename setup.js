const fs = require('fs');
const path = require('path');

// REPLACE THESE WITH YOUR ACTUAL KEYS
const CLOUDINARY_API_KEY = '983623387191435';
const CLOUDINARY_API_SECRET = 'dWUYMgaJHSlFC21ANmzt3ohFpSM';
const RESEND_API_KEY = 're_BeLC9yTZ_N4choBWWV7mbLm8n9cH1toYu';

// Create directories
const dirs = [
  'pages',
  'pages/api',
  'pages/a',
  'components',
  'lib',
  'styles'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Define all files
const files = {
  'package.json': `{
  "name": "audio-share-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "cloudinary": "^2.0.0",
    "formidable": "^3.5.1",
    "axios": "^1.6.0",
    "resend": "^2.0.0",
    "@vercel/kv": "^1.0.0",
    "nanoid": "^5.0.0"
  }
}`,

  '.env.local': `# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=drsuioeqg
CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY}
CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET}

# Your Domain
NEXT_PUBLIC_DOMAIN=https://epiphanyindia.com

# Resend Email
RESEND_API_KEY=${RESEND_API_KEY}
EMAIL_FROM=noreply@epiphanyindia.com

# Vercel KV (auto-filled when deployed)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=`,

  'pages/index.js': `import { useState } from 'react';
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
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
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
      
      const link = \`\${window.location.origin}/a/\${response.data.shortId}\`;
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
}`,

  'pages/_app.js': `import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;`,

  'pages/api/upload.js': `import formidable from 'formidable';
import { v2 as cloudinary } from 'cloudinary';
import { nanoid } from 'nanoid';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// In-memory storage for development
const storage = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  
  try {
    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const filename = Array.isArray(fields.filename) ? fields.filename[0] : fields.filename;
    
    const result = await cloudinary.uploader.upload(file.filepath, {
      resource_type: 'auto',
      folder: 'audio-shares',
      type: 'authenticated',
      access_mode: 'public'
    });

    const shortId = nanoid(6);
    
    const data = {
      cloudinaryId: result.public_id,
      cloudinaryUrl: result.secure_url,
      uploaderEmail: email,
      filename: filename,
      uploadDate: new Date().toISOString(),
      downloaded: false
    };

    storage.set(\`audio:\${shortId}\`, data);

    res.status(200).json({ 
      shortId: shortId,
      message: 'Upload successful'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}`,

  'pages/api/download.js': `import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = global.storage || new Map();
global.storage = storage;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { shortId, termsAccepted } = req.body;

  if (!termsAccepted) {
    return res.status(403).json({ error: 'Terms must be accepted' });
  }

  try {
    const fileData = storage.get(\`audio:\${shortId}\`);

    if (!fileData) {
      return res.status(404).json({ error: 'File not found or expired' });
    }

    if (fileData.downloaded) {
      return res.status(410).json({ error: 'File has already been downloaded' });
    }

    const downloadUrl = cloudinary.url(fileData.cloudinaryId, {
      resource_type: 'auto',
      type: 'authenticated',
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) + 300,
      flags: 'attachment'
    });

    fileData.downloaded = true;
    fileData.downloadDate = new Date().toISOString();
    storage.set(\`audio:\${shortId}\`, fileData);

    setTimeout(async () => {
      try {
        await cloudinary.uploader.destroy(fileData.cloudinaryId, {
          resource_type: 'auto',
          type: 'authenticated'
        });
        storage.delete(\`audio:\${shortId}\`);
      } catch (error) {
        console.error('Deletion error:', error);
      }
    }, 10000);

    res.status(200).json({ 
      url: downloadUrl,
      filename: fileData.filename,
      email: fileData.uploaderEmail
    });
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
}`,

  'pages/api/notify.js': `import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, filename } = req.body;

  try {
    const emailHtml = \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">🎵 Your Audio File Was Downloaded!</h2>
        <p>Hello,</p>
        <p>Your audio file "<strong>\${filename}</strong>" has just been downloaded.</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>File Details:</strong></p>
          <ul>
            <li>File name: \${filename}</li>
            <li>Download date: \${new Date().toLocaleString()}</li>
          </ul>
        </div>
        <p><strong>Note:</strong> The file has been automatically deleted from our servers after download.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated notification from Epiphany India Audio Share.
        </p>
      </div>
    \`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Audio Share <noreply@epiphanyindia.com>',
      to: email,
      subject: \`✅ Your audio file "\${filename}" was downloaded\`,
      html: emailHtml,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    res.status(200).json({ success: false });
  }
}`,

  'pages/a/[id].js': `import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TermsModal from '../../components/TermsModal';
import axios from 'axios';

export default function DownloadPage() {
  const router = useRouter();
  const { id } = router.query;
  const [showTerms, setShowTerms] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [downloadComplete, setDownloadComplete] = useState(false);

  useEffect(() => {
    if (id) {
      setFileInfo({
        id: id,
        status: 'Ready for download'
      });
    }
  }, [id]);

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
      const response = await axios.post('/api/download', { 
        shortId: id,
        termsAccepted: true
      });
      
      if (response.data.url) {
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = response.data.filename || 'audio-file';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
        }, 5000);
        
        setDownloadComplete(true);
        
        await axios.post('/api/notify', { 
          email: response.data.email,
          filename: response.data.filename
        });
        
        setTimeout(() => {
          alert('✅ Download complete! This file has been deleted from our servers.');
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setError('File not found or has expired');
      } else if (error.response?.status === 410) {
        setError('This file has already been downloaded');
      } else {
        setError('Download failed. Please try again.');
      }
    }
    setDownloading(false);
  };

  return (
    <div className="container">
      {showTerms && !termsAccepted && (
        <TermsModal 
          onAccept={handleAcceptTerms}
          onReject={handleRejectTerms}
          canClose={false}
        />
      )}
      
      <div className="download-page">
        <h1>🎵 Audio File Ready</h1>
        
        <div className="file-info">
          <div className="info-item">
            <span className="info-label">Link ID:</span>
            <span className="info-value">{id}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value">{fileInfo?.status}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Note:</span>
            <span className="info-value">File will be deleted after download</span>
          </div>
        </div>

        {error && (
          <div className="error-message">❌ {error}</div>
        )}

        {downloadComplete && (
          <div className="success-message">
            ✅ Download started! Check your downloads folder.
          </div>
        )}

        <div className="download-section">
          {!termsAccepted && (
            <div className="warning-box">
              ⚠️ You must accept our terms and conditions to download this file
            </div>
          )}
          
          <button 
            onClick={handleDownload}
            disabled={downloading || downloadComplete}
            className={\`download-btn \${termsAccepted ? 'active' : 'disabled'}\`}
          >
            {downloading ? (
              <span>⏳ Preparing Download...</span>
            ) : downloadComplete ? (
              <span>✅ Downloaded</span>
            ) : (
              <span>⬇️ Download Audio File</span>
            )}
          </button>

          {termsAccepted && (
            <div className="accepted-badge">
              ✅ Terms & Conditions Accepted
            </div>
          )}
        </div>
      </div>
    </div>
  );
}`,

  'components/TermsModal.js': `import { useState, useEffect } from 'react';

export default function TermsModal({ onAccept, onReject, canClose }) {
  const [agreed, setAgreed] = useState(false);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e) => {
    const element = e.target;
    const threshold = 50;
    const isAtBottom = element.scrollHeight - element.scrollTop - element.clientHeight < threshold;
    if (isAtBottom) {
      setScrolledToBottom(true);
    }
  };

  const canAccept = agreed && scrolledToBottom && timeSpent >= 5;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>📜 Terms and Conditions</h2>
          <p className="modal-subtitle">Please read carefully before downloading</p>
        </div>
        
        <div className="terms-content" onScroll={handleScroll}>
          <h3>Audio File Download Agreement</h3>
          
          <p className="terms-intro">
            By downloading this audio file, you acknowledge and agree to be bound by the following terms and conditions:
          </p>
          
          <section className="terms-section">
            <h4>1. LICENSE GRANT</h4>
            <p>The audio file ("Content") is provided for personal, non-commercial use only.</p>
          </section>

          <section className="terms-section">
            <h4>2. RESTRICTIONS</h4>
            <p>You SHALL NOT redistribute, share, sell, or modify the Content.</p>
          </section>

          <section className="terms-section">
            <h4>3. INTELLECTUAL PROPERTY</h4>
            <p>All rights remain with the original copyright holder.</p>
          </section>

          <section className="terms-section">
            <h4>4. PRIVACY</h4>
            <p>Your download will be logged and the uploader will be notified.</p>
          </section>

          <section className="terms-section">
            <h4>5. LIABILITY</h4>
            <p>The content is provided "AS IS" without any warranties.</p>
          </section>
          
          {!scrolledToBottom && (
            <div className="scroll-indicator">
              ⬇️ Please scroll to read all terms ⬇️
            </div>
          )}
        </div>

        <div className="modal-footer">
          {timeSpent < 5 && (
            <div className="timer-notice">
              Please read the terms carefully ({5 - timeSpent}s)
            </div>
          )}
          
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={!scrolledToBottom || timeSpent < 5}
            />
            <span>I have read, understood, and agree to the terms and conditions</span>
          </label>
          
          <div className="modal-buttons">
            <button onClick={onReject} className="reject-btn">
              Decline
            </button>
            <button 
              onClick={onAccept}
              disabled={!canAccept}
              className="accept-btn"
            >
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,

  'styles/globals.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  max-width: 500px;
  width: 100%;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

.upload-section {
  text-align: center;
}

.file-label {
  display: inline-block;
  padding: 20px 30px;
  background: linear-gradient(145deg, #f0f0f0, #fafafa);
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  border: 2px dashed #ccc;
  width: 100%;
}

.file-label:hover {
  background: linear-gradient(145deg, #e0e0e0, #f0f0f0);
  border-color: #667eea;
}

.file-icon, .upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.file-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.email-section {
  margin-bottom: 25px;
  text-align: left;
}

.email-label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.email-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
}

.email-input:focus {
  outline: none;
  border-color: #667eea;
}

.upload-btn, .download-btn, .accept-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}

.upload-btn:hover, .download-btn.active:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.upload-btn:disabled, .download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.download-btn.disabled {
  background: linear-gradient(135deg, #ccc 0%, #aaa 100%);
}

.success-section {
  text-align: center;
}

.success-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.link-box {
  display: flex;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  background: #f9f9f9;
  margin: 20px 0;
}

.link-input {
  flex: 1;
  padding: 12px 15px;
  border: none;
  font-size: 14px;
  font-family: monospace;
}

.copy-btn {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.notification-info {
  background: #f0f7ff;
  border: 1px solid #cce5ff;
  border-radius: 10px;
  padding: 15px;
  margin: 20px 0;
  color: #0066cc;
  font-size: 14px;
}

.new-upload-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 600;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 12px 15px;
  border-radius: 8px;
  margin: 15px 0;
  font-size: 14px;
}

.success-message {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 12px 15px;
  border-radius: 8px;
  margin: 15px 0;
  font-size: 14px;
}

.warning-box {
  background: #fff3e0;
  color: #e65100;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
}

.file-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  margin: 25px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.info-item:last-child {
  border-bottom: none;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 15px;
  max-width: 650px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 70px rgba(0,0,0,0.4);
}

.modal-header {
  padding: 25px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px 15px 0 0;
}

.modal-header h2 {
  margin: 0;
  color: white;
  font-size: 24px;
}

.modal-subtitle {
  margin: 5px 0 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.terms-content {
  flex: 1;
  padding: 25px;
  overflow-y: auto;
  max-height: 450px;
}

.terms-section {
  margin-bottom: 20px;
}

.terms-section h4 {
  color: #333;
  margin-bottom: 10px;
  font-size: 16px;
}

.scroll-indicator {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 10px;
  text-align: center;
  color: #667eea;
  font-weight: 600;
}

.modal-footer {
  padding: 20px 25px;
  background: #f9f9f9;
  border-radius: 0 0 15px 15px;
}

.timer-notice {
  text-align: center;
  color: #ff9800;
  margin-bottom: 15px;
  font-size: 13px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 10px;
  margin-top: 2px;
  width: 18px;
  height: 18px;
}

.checkbox-label span {
  color: #555;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.reject-btn {
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  font-weight: 600;
}

.accept-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .container {
    padding: 25px;
  }
  
  .modal {
    max-height: 90vh;
  }
  
  .modal-buttons {
    flex-direction: column;
  }
}`
};

// Create all files
Object.entries(files).forEach(([filename, content]) => {
  const filePath = path.join(process.cwd(), filename);
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filename}`);
});

console.log('\n🎉 All files created successfully!');
console.log('\n📝 IMPORTANT: Edit the API keys at the top of this file before running!');
console.log('\nNext steps:');
console.log('1. Open terminal in VS Code');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('4. Open http://localhost:3000 in your browser');
console.log('\n✨ Your app is ready to use!');