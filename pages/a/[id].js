import { useState, useEffect } from 'react';
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
      console.log('Requesting download for:', id);
      
      // Request download from API
      const response = await axios.post('/api/download', { 
        shortId: id,
        termsAccepted: true
      });
      
      console.log('Download response received:', response.data);
      
      if (response.data.url) {
        // Single download method - using blob for better filename control
        try {
          console.log('Downloading file as:', response.data.filename);
          
          // Fetch the file as blob
          const fileResponse = await fetch(response.data.url);
          const blob = await fileResponse.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          // Create download link
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = response.data.filename || 'audio-file';
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // Clean up the blob URL
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 1000);
          
          console.log('File downloaded successfully');
        } catch (fetchError) {
          // Fallback: If blob fails, use direct link
          console.log('Blob download failed, using direct link');
          const link = document.createElement('a');
          link.href = response.data.url;
          link.download = response.data.filename || 'audio-file';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
          }, 100);
        }
        
        // Mark download as complete
        setDownloadComplete(true);
        
        // IMPORTANT: Send email notification to uploader
        console.log('Sending email notification...');
        console.log('Email to:', response.data.email);
        console.log('Filename:', response.data.filename);
        
        try {
          const emailResponse = await axios.post('/api/notify', { 
            email: response.data.email,
            filename: response.data.filename
          });
          
          console.log('Email notification response:', emailResponse.data);
          
          if (emailResponse.data.success) {
            console.log('✅ Email sent successfully!');
          } else {
            console.log('⚠️ Email sending failed:', emailResponse.data.error);
          }
        } catch (emailError) {
          console.error('❌ Email notification error:', emailError.response?.data || emailError.message);
          // Don't block the download if email fails
          console.log('Download completed but email notification failed');
        }
        
        // Show completion message and redirect
        setTimeout(() => {
          alert('✅ Download complete! This file has been deleted from our servers.');
          router.push('/');
        }, 3000);
      }
    } catch (error) {
      console.error('Download error:', error);
      
      if (error.response?.status === 404) {
        setError('File not found or has expired');
      } else if (error.response?.status === 410) {
        setError('This file has already been downloaded');
      } else {
        setError('Download failed. Please try again.');
      }
      
      setDownloading(false);
    }
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
            className={`download-btn ${termsAccepted ? 'active' : 'disabled'}`}
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
}