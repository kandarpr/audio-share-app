import React from 'react';

const TermsModal = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Terms and Conditions</h2>
        <div className="terms-text">
          <h3>AUDIO FILE DOWNLOAD - TERMS OF USE</h3>
          <p className="terms-subtitle">By downloading this file, you agree to these legally binding terms:</p>
          
          <div className="warning-notice">
            <strong>⚠️ IMPORTANT:</strong> This audio file is protected by copyright law. Unauthorized use, distribution, or reproduction is strictly prohibited and may result in legal action.
          </div>

          <h4>1. LICENSE GRANT</h4>
          <p>The copyright holder grants you a <strong>limited, non-exclusive, non-transferable license</strong> to download and review this audio file solely for:</p>
          <ul>
            <li>Personal evaluation and review only</li>
            <li>Internal assessment for potential licensing</li>
            <li>Professional feedback to the copyright holder</li>
          </ul>

          <h4>2. RESTRICTIONS - YOU MAY NOT:</h4>
          <ul>
            <li><strong>Distribute or Share:</strong> Upload, share, or transmit this file to any third party, platform, or service</li>
            <li><strong>Commercial Use:</strong> Use this audio in any commercial project without written permission</li>
            <li><strong>Public Performance:</strong> Broadcast, stream, or publicly perform this audio</li>
            <li><strong>Modification:</strong> Edit, remix, sample, or create derivative works</li>
            <li><strong>Re-recording:</strong> Re-record or reproduce this audio in any format</li>
            <li><strong>Synchronization:</strong> Use this audio with video, images, or other media</li>
            <li><strong>AI/ML Training:</strong> Use this audio to train, fine-tune, or improve any artificial intelligence, machine learning, or neural network models</li>
            <li><strong>Data Mining:</strong> Extract, analyze, or process this audio for dataset creation or pattern recognition</li>
            <li><strong>Claim Ownership:</strong> Represent this work as your own or register it with any service</li>
          </ul>

          <h4>3. AI & MACHINE LEARNING PROHIBITION</h4>
          <p><strong className="important-text">This audio file may NOT be used for any AI/ML purposes whatsoever.</strong> Specifically prohibited uses include:</p>
          <ul>
            <li>Training or fine-tuning any AI model (including voice synthesis, music generation, or audio analysis models)</li>
            <li>Creating voice clones, synthetic voices, or voice conversion systems</li>
            <li>Inclusion in any dataset, corpus, or training material</li>
            <li>Input for AI-powered audio manipulation or generation tools</li>
            <li>Analysis by automated systems for pattern extraction or learning</li>
          </ul>
          <p>This prohibition applies to both commercial and non-commercial AI/ML uses, including research and educational purposes.</p>

          <h4>4. INTELLECTUAL PROPERTY</h4>
          <p>This audio file and all associated rights remain the exclusive property of the copyright holder. This agreement does not transfer any ownership rights to you.</p>

          <h4>5. DATA COLLECTION & TRACKING</h4>
          <p>By downloading this file, you acknowledge that:</p>
          <ul>
            <li>Your IP address, download time, and device information have been logged</li>
            <li>This information may be used as evidence in case of unauthorized use</li>
            <li>The copyright holder may pursue legal action for violations</li>
          </ul>

          <h4>6. CONFIDENTIALITY</h4>
          <p>You agree to treat this audio file as confidential information. You shall not disclose, discuss, or share details about this audio with third parties without prior written consent.</p>

          <h4>7. TERMINATION</h4>
          <p>This license is effective until terminated. Your rights will terminate automatically without notice if you fail to comply with any terms. Upon termination, you must destroy all copies of the audio file.</p>

          <h4>8. LIABILITY & DAMAGES</h4>
          <p>Unauthorized use may cause irreparable harm. You agree to be liable for:</p>
          <ul>
            <li>Actual damages resulting from unauthorized use</li>
            <li>Legal fees and court costs</li>
            <li>Statutory damages as permitted by law</li>
          </ul>

          <div className="warning-notice">
            <strong>BY CLICKING "I AGREE", YOU CONFIRM THAT:</strong>
            <ul>
              <li>You have read and understood these terms</li>
              <li>You agree to be legally bound by these terms</li>
              <li>You have the legal capacity to enter into this agreement</li>
              <li>Violation of these terms may result in legal action</li>
            </ul>
          </div>
        </div>
        
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={onAgree} className="btn-primary">I Agree</button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;